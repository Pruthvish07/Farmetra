import { Diagnosis } from "../types";

/**
 * Helper to convert a Data URL (base64) into a Blob object for FormData upload.
 */
const dataURLtoBlob = (dataUrl: string): Blob => {
  const parts = dataUrl.split(";base64,");
  if (parts.length < 2) {
    throw new Error("Invalid base64 image data.");
  }
  const contentType = parts[0].split(":")[1] || "image/jpeg";
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

/**
 * Sends the uploaded crop leaf image to the relative backend endpoint (/api/diagnose)
 * as FormData. It handles server errors with automatic retry on rate limits or 503 errors,
 * and parses the returned Diagnosis object.
 */
export const analyzeCropImage = async (
  base64Image: string,
  maxRetries = 3,
  initialDelay = 1500
): Promise<Diagnosis> => {
  let attempt = 0;
  
  while (true) {
    try {
      // Convert the base64 image string to a real Blob object
      const imageBlob = dataURLtoBlob(base64Image);
      
      // Create FormData payload
      const formData = new FormData();
      formData.append("image", imageBlob, "crop_leaf.jpg");

      // Perform fetch request to the relative backend API endpoint
      const response = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const isServerBusy = response.status === 503 || response.status === 429;
        const errText = await response.text();
        let errorMessage = `Server error ${response.status}`;
        try {
          const errJson = JSON.parse(errText);
          errorMessage = errJson.error || errorMessage;
        } catch {
          if (errText) errorMessage = errText;
        }

        const isBusyMessage = 
          errorMessage.toLowerCase().includes("busy") || 
          errorMessage.toLowerCase().includes("overloaded") || 
          errorMessage.toLowerCase().includes("experiencing high demand") || 
          errorMessage.toLowerCase().includes("resource_exhausted") || 
          errorMessage.toLowerCase().includes("exhausted");

        if ((isServerBusy || isBusyMessage) && attempt < maxRetries) {
          attempt++;
          const backoffTime = initialDelay * Math.pow(2, attempt - 1);
          console.warn(`[AI Engine] Model is busy / experiencing high demand. Retrying in ${backoffTime}ms (Attempt ${attempt}/${maxRetries})...`);
          await new Promise((resolve) => setTimeout(resolve, backoffTime));
          continue;
        }

        if (response.status === 503) {
          throw new Error("The AI server is busy right now. Please wait a moment and try again.");
        }

        if (response.status === 404) {
          throw new Error("CNN ENGINE RETURNED ERROR 404: The endpoint was not found on this server.");
        }
        throw new Error(errorMessage);
      }

      const diagnosisResult: Diagnosis = await response.json();
      return diagnosisResult;
    } catch (error: any) {
      // Catch network or fetch failures and retry if eligible
      const isNetworkError = error instanceof TypeError;
      const isBusyMessage = 
        error.message?.toLowerCase().includes("busy") || 
        error.message?.toLowerCase().includes("demand") || 
        error.message?.toLowerCase().includes("resource_exhausted");

      if ((isNetworkError || isBusyMessage) && attempt < maxRetries) {
        attempt++;
        const backoffTime = initialDelay * Math.pow(2, attempt - 1);
        console.warn(`[AI Engine] Connection failure or busy state detected. Retrying in ${backoffTime}ms (Attempt ${attempt}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        continue;
      }

      console.error("Frontend analysis fetch failure:", error);
      throw error;
    }
  }
};

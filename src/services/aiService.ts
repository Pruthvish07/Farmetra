import { Diagnosis } from "../types";

export const analyzeCropImage = async (base64Image: string): Promise<Diagnosis> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Agri-Intel CNN Engine returned error ${response.status}`);
    }

    const diagnosis = await response.json();
    return {
      ...diagnosis,
      imageUrl: base64Image,
    };
  } catch (error: any) {
    console.error("Pathology server communication error:", error);
    throw error;
  }
};

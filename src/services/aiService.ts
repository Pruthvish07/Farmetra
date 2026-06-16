import { GoogleGenAI, Type } from "@google/genai";
import { Diagnosis } from "../types";
import { stripBase64Prefix } from "../lib/imageUtils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeCropImage = async (base64Image: string): Promise<Diagnosis> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured in this environment.");
  }

  const base64Data = stripBase64Prefix(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: "Identify the crop and analyze any visible diseases or pests. Provide symptoms, organic treatments, and preventive measures.",
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: "You are a professional plant pathologist. Carefully examine the visual evidence to diagnose plant issues. If the image is unclear, do not ask for a new one immediately; instead, describe what you can see and suggest what the user should focus on in a follow-up photo. Return the result in JSON format only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            diseaseType: { type: Type.STRING, enum: ['Fungal', 'Bacterial', 'Viral', 'Pest', 'Healthy'] },
            confidence: { type: Type.NUMBER },
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['cropName', 'diseaseName', 'diseaseType', 'confidence', 'severity', 'symptoms', 'treatment', 'preventiveMeasures'],
        },
      },
    });

    if (!response.text) {
      throw new Error("The AI service returned an empty response. Please try with a clearer image.");
    }

    const diagnosis = JSON.parse(response.text);
    
    return {
      ...diagnosis,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      imageUrl: base64Image,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid Gemini API key. Please check your project settings.");
    }
    throw error;
  }
};

import { GoogleGenAI, Type } from "@google/genai";
import { Diagnosis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeCropImage = async (base64Image: string): Promise<Diagnosis> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: "Analyze this image of a plant leaf and identify if it has any disease. Provide a detailed diagnosis in JSON format.",
          },
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: "image/jpeg",
            },
          },
        ],
      },
    ],
    config: {
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

  const diagnosis = JSON.parse(response.text);
  
  return {
    ...diagnosis,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    imageUrl: base64Image,
  };
};

import { GoogleGenAI, Type } from "@google/genai";
import { Diagnosis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeCropImage = async (base64Image: string): Promise<Diagnosis> => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const [mimeInfo, base64Data] = base64Image.split(';base64,');
  const mimeType = mimeInfo.split(':')[1] || "image/jpeg";

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: [
      {
        parts: [
          {
            text: "Identify the crop and analyze any visible diseases or pests. Provide symptoms, organic treatments, and preventive measures.",
          },
          {
            inlineData: {
              data: base64Data || base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
    config: {
      systemInstruction: "You are a professional plant pathologist. Carefully examine the visual evidence to diagnose plant issues. If you are unsure, provide your best clinical assessment. Return the result in JSON format only.",
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

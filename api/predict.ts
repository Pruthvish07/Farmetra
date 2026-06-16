import type { VercelRequest, VercelResponse } from "@vercel/node";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";

// 1. Initialize Multer Memory Storage for file parsing in serverless environment
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB upload limit
});

// Helper to run traditional Express middlewares in Vercel Serverless environment
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Ensure Multer doesn't parse body during import, only during execution
const singleUpload = upload.single("image");

// Disable Vercel's default body parser to let Multer handle multipart/form-data parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Toggle CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
  }

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error("Vercel Configuration Error: GEMINI_API_KEY is not defined in Environment variables.");
      return res.status(500).json({
        error: "Server configuration issue: GEMINI_API_KEY environment variable is not defined on Vercel.",
      });
    }

    // 2. Parse Multipart Form Handler using Multer
    await runMiddleware(req, res, singleUpload);

    const anyReq = req as any;
    if (!anyReq.file) {
      return res.status(400).json({ error: "Bad Request: No crop leaf image file uploaded." });
    }

    const imageBuffer = anyReq.file.buffer;
    const base64Data = imageBuffer.toString("base64");
    const mimeType = anyReq.file.mimetype || "image/jpeg";

    // 3. Initialize Google Gemini SDK client
    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // 4. Send analysis query to the active Gemini Flash model
    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          parts: [
            {
              text: "Identify the crop and analyze any visible diseases or pests. Provide symptoms, organic treatments, and preventive measures.",
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction:
          "You are a professional plant pathologist. Carefully examine the visual agriculture evidence to diagnose plant diseases, pathogens, and nutrient deficiencies. If the image is unclear or not a plant, explain what you see and guide the user on what details to capture next. Always return the analysis in JSON format conforming to the exact schema properties.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING, description: "The name of the crop or plant identified" },
            diseaseName: { type: Type.STRING, description: "Specific name of the disease or Pest, or 'Healthy'" },
            diseaseType: {
              type: Type.STRING,
              enum: ["Fungal", "Bacterial", "Viral", "Pest", "Healthy"],
              description: "Category of the threat",
            },
            confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0" },
            severity: {
              type: Type.STRING,
              enum: ["Low", "Medium", "High"],
              description: "Urgency/Severity level",
            },
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Detailed observable visual symptoms on leaves/stems",
            },
            treatment: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Organic remedies and immediate non-chemical treatments",
            },
            preventiveMeasures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Preventative procedures for future protection",
            },
          },
          required: [
            "cropName",
            "diseaseName",
            "diseaseType",
            "confidence",
            "severity",
            "symptoms",
            "treatment",
            "preventiveMeasures",
          ],
        },
      },
    });

    if (!aiResponse.text) {
      throw new Error("No response string received from Google Gemini Pathologist Engine.");
    }

    const diagnosis = JSON.parse(aiResponse.text);

    // 5. Structure custom fields for the Farmetra Client UI
    const finalizedDiagnosis = {
      ...diagnosis,
      id: "diag_" + Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      imageUrl: `data:${mimeType};base64,${base64Data}`,
    };

    return res.status(200).json(finalizedDiagnosis);
  } catch (error: any) {
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred in the Gemini CNN serverless function.",
    });
  }
}

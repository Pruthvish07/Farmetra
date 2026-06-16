import "dotenv/config";
import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const app = express();

// Set up memory storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Configure Gemini SDK client
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// JSON or Urlencoded parsers for other form inputs (if needed)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/**
 * Handle crop leaf diagnostics/predictions using Gemini 3.5 Flash Model
 */
const handleCropAnalysis = async (req: express.Request, res: express.Response) => {
  try {
    if (!geminiApiKey) {
      console.error("Server API key missing");
      return res.status(500).json({
        error: "Server configuration issue: GEMINI_API_KEY is not defined in backend process environments.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Missing uploaded crop image file." });
    }

    const imageBuffer = req.file.buffer;
    const base64Data = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    console.log(`Analyzing image of type ${mimeType}, size: ${imageBuffer.length} bytes`);

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
      throw new Error("No textual response returned from the Gemini pathologist engine.");
    }

    const diagnosis = JSON.parse(aiResponse.text);

    // Return final standardized Diagnosis object structure
    const finalizedDiagnosis = {
      ...diagnosis,
      id: "diag_" + Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      imageUrl: `data:${mimeType};base64,${base64Data}`,
    };

    return res.json(finalizedDiagnosis);
  } catch (error: any) {
    console.error("Backend diagnosis handler error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred in the Gemini CNN engine.",
    });
  }
};

// Mount both relative routes to protect against either calling structure
app.post("/api/diagnose", upload.single("image"), handleCropAnalysis);
app.post("/api/predict", upload.single("image"), handleCropAnalysis);

// Server health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Farmetra Web Service", api_key_loaded: !!geminiApiKey });
});

/**
 * Configure Asset Pipelines / Routing Middleware
 */
async function bootstrapServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode (integrating Vite as middleware)
    console.log("Starting Farmetra in Development mode (Vite HMR/Middleware enabled)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode (serving pre-compiled frontend assets)
    console.log("Starting Farmetra in Production mode (Static distribution serving enabled)...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Farmetra backend server running successfully on http://localhost:${PORT}`);
  });
}

bootstrapServer();

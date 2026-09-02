import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
 // Vite default
app.use(express.json({ limit: "1mb" }));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY missing in server/.env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Recommendations endpoint
app.post("/api/recommendations", async (req, res) => {
  try {
    const { profile, result } = req.body;

    if (!profile || !result) {
      return res.status(400).json({ error: "Missing profile or result" });
    }

    const prompt = `
Analyze this student profile for campus placements.

Student Data:
- CGPA: ${profile.cgpa}
- Branch: ${profile.branch}
- Internships: ${profile.internships} (Relevance: ${profile.internshipRelevance}/10)
- Projects: ${profile.projects} (Complexity: ${profile.projectComplexity}/10, Docs: ${profile.projectDocumentation}/10)
- Active Backlogs: ${profile.backlogs}
- Technical Scores: Coding DSA(${profile.codingDSA}), Coding Dev(${profile.codingDev}), Aptitude(${profile.aptitudeScore})
- Predicted Placement Probability: ${(result.probability * 100).toFixed(1)}%

Return JSON with:
- analysis (string)
- tips (array of {category, priority, tip})
- idealCompanies (array of strings)
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ["category", "priority", "tip"],
              },
            },
            idealCompanies: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["analysis", "tips", "idealCompanies"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gemini failed", detail: String(e?.message || e) });
  }
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});

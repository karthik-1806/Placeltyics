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
  console.warn("⚠️ GEMINI_API_KEY not found in environment. Running with intelligent fallback recommendations. Add your key to .env to enable live Gemini AI generation.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Recommendations endpoint
app.post("/api/recommendations", async (req, res) => {
  try {
    const { profile, result } = req.body;

    if (!profile || !result) {
      return res.status(400).json({ error: "Missing profile or result" });
    }

    if (!ai) {
      return res.json({
        analysis: `Profile Assessment: With a CGPA of ${profile.cgpa || 7.5}, ${profile.projects || 1} project(s), and ${profile.internships || 0} internship(s), placement probability is estimated at ${((result.probability || 0.7) * 100).toFixed(1)}%. Core technical aptitude and systematic problem solving will be key drivers for placement success.`,
        tips: [
          {
            category: "Data Structures & Algorithms",
            priority: "High",
            tip: "Practice 2-3 LeetCode medium questions daily, especially Dynamic Programming, Trees, and Graphs."
          },
          {
            category: "Full-Stack Projects",
            priority: "Medium",
            tip: "Deploy at least two full-stack projects with live demo URLs, CI/CD pipeline, and comprehensive README documentation."
          },
          {
            category: "Interview Preparation",
            priority: "High",
            tip: "Practice mock behavioral and technical interviews emphasizing the STAR method and system design fundamentals."
          }
        ],
        idealCompanies: ["Amazon", "TCS Digital", "Infosys (Power Programmer)", "Cognizant GenC Next", "Accenture Advanced ASE"]
      });
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
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Backend running on http://localhost:${port}`);
  });
}

export default app;

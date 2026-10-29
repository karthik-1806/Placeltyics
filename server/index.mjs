import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();

// Allowed origins configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server) or matching allowed origins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: origin not allowed"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "256kb" }));

// Safe structured logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    // Safe log: Never log secrets, email, or sensitive personal data
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: duration,
      })
    );
  });
  next();
});

// Lightweight rate limiting: 45 requests per minute per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 45;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    clientData.count += 1;
  }

  rateLimitMap.set(ip, clientData);

  // Periodic cleanup
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) rateLimitMap.delete(key);
    }
  }

  if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please wait a moment before requesting more recommendations.",
    });
  }

  next();
};

function getAIClient() {
  dotenv.config({ override: true });
  const key = process.env.GEMINI_API_KEY;
  return key ? new GoogleGenAI({ apiKey: key }) : null;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  dotenv.config({ override: true });
  res.json({
    status: "ok",
    service: "Placeltyics Backend API",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Helper: Payload validation & sanitation
function validateProfilePayload(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid JSON request body" };
  }

  const { profile, result, persona } = body;
  if (!profile || typeof profile !== "object") {
    return { valid: false, error: "Missing or invalid 'profile' object" };
  }
  if (!result || typeof result !== "object") {
    return { valid: false, error: "Missing or invalid 'result' object" };
  }

  const numChecks = [
    { field: "cgpa", val: profile.cgpa, min: 0, max: 10 },
    { field: "internships", val: profile.internships, min: 0, max: 20 },
    { field: "projects", val: profile.projects, min: 0, max: 50 },
    { field: "backlogs", val: profile.backlogs, min: 0, max: 30 },
    { field: "codingDSA", val: profile.codingDSA, min: 0, max: 100 },
    { field: "codingDev", val: profile.codingDev, min: 0, max: 100 },
    { field: "aptitudeScore", val: profile.aptitudeScore, min: 0, max: 100 },
    { field: "communicationScore", val: profile.communicationScore, min: 0, max: 10 },
  ];

  for (const check of numChecks) {
    if (typeof check.val !== "number" || isNaN(check.val) || check.val < check.min || check.val > check.max) {
      return {
        valid: false,
        error: `Field '${check.field}' must be a number between ${check.min} and ${check.max}`,
      };
    }
  }

  if (typeof result.probability !== "number" || isNaN(result.probability) || result.probability < 0 || result.probability > 1) {
    return { valid: false, error: "Field 'result.probability' must be a number between 0 and 1" };
  }

  const sanitizedPersona = ["strategist", "interviewer", "mentor"].includes(persona)
    ? persona
    : "strategist";

  return { valid: true, sanitizedPersona };
}

// Fallback recommendations generator
function generateHeuristicRecommendations(profile, result, persona) {
  const probPercent = ((result.probability || 0.65) * 100).toFixed(1);
  const isHighReady = result.probability >= 0.75;
  const hasBacklogs = profile.backlogs > 0;

  if (persona === "interviewer") {
    return {
      analysis: `Interviewer Perspective: At ${probPercent}% placement readiness, your technical foundation (${profile.codingDSA}/100 DSA, ${profile.codingDev}/100 Dev) indicates ${isHighReady ? "solid readiness for technical coding rounds" : "that technical screening rounds will require rigorous timed simulation"}. Interviewers will scrutinize your ${profile.projects} project(s) and architectural decisions.`,
      tips: [
        {
          category: "Live Coding Rounds",
          priority: "High",
          tip: "Practice explaining your thought process out loud while writing DSA code; clarify edge cases and time/space complexity before coding."
        },
        {
          category: "Technical Deep-Dive",
          priority: "High",
          tip: "Be prepared to draw architecture diagrams for your key projects and defend your choice of database, state management, and API design."
        },
        {
          category: "Behavioral Rounds",
          priority: "Medium",
          tip: "Structure answers using the STAR method (Situation, Task, Action, Result) for conflict resolution and engineering challenges."
        }
      ],
      idealCompanies: isHighReady
        ? ["Amazon", "Microsoft", "Oracle", "Goldman Sachs", "Atlassian"]
        : ["TCS Digital", "Infosys (Power Programmer)", "Cognizant GenC Next", "Accenture Advanced ASE", "Persistent Systems"]
    };
  }

  if (persona === "mentor") {
    return {
      analysis: `Mentor Perspective: With a CGPA of ${profile.cgpa} and ${profile.projects} completed project(s), you have built commendable momentum. Placement season can feel overwhelming, but structured daily consistency is far more effective than last-minute cramming. Protect your mental clarity and sleep.`,
      tips: [
        {
          category: "Study Rhythm",
          priority: "High",
          tip: "Set a sustainable daily routine: 2 hours of DSA in the morning, 1 hour of core CS concepts (OS/DBMS/CN), and 1 hour of project review."
        },
        {
          category: "Peer Preparation",
          priority: "Medium",
          tip: "Form a study group with 2-3 motivated peers to conduct weekly mock interviews and review each other's resumes."
        },
        {
          category: "Mental Resilience",
          priority: "Medium",
          tip: "Treat rejections during early placement rounds as data for refinement rather than a reflection of your potential."
        }
      ],
      idealCompanies: isHighReady
        ? ["Google", "Adobe", "Salesforce", "Cisco", "Product Startups"]
        : ["Wipro Turbo", "LTIMindtree", "Capgemini", "Hexaware", "Virtusa"]
    };
  }

  // Default: Strategist
  return {
    analysis: `Strategic Career Advisory: Your profile achieves a calculated readiness score of ${probPercent}%. ${hasBacklogs ? "Your active backlog is your highest-risk hurdle; clearing it must be your primary milestone." : "Your academic and project profile positions you well across recruitment tiers."} Focus on high-leverage differentiators over the next 90 days.`,
    tips: [
      {
        category: "Data Structures & Algorithms",
        priority: profile.codingDSA < 70 ? "High" : "Medium",
        tip: "Focus on Trees, Graphs, Dynamic Programming, and Heap problems on LeetCode/CodeChef to excel in technical screening rounds."
      },
      {
        category: "Portfolio & Deployment",
        priority: "High",
        tip: "Ensure your top two full-stack projects feature live deployed URLs, comprehensive documentation, and automated tests."
      },
      {
        category: "Aptitude & Core Fundamentals",
        priority: profile.aptitudeScore < 70 ? "High" : "Low",
        tip: "Review Quantitative Aptitude shortcuts, DBMS SQL queries, and Operating System threading concepts weekly."
      }
    ],
    idealCompanies: isHighReady
      ? ["Amazon", "Uber", "TCS Digital", "Infosys (Specialist Programmer)", "DE Shaw"]
      : ["TCS Digital", "Cognizant GenC Next", "Accenture Advanced ASE", "Infosys", "Tech Mahindra"]
  };
}

// Recommendations endpoint
app.post("/api/recommendations", rateLimiter, async (req, res) => {
  try {
    const validation = validateProfilePayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: "Validation Error", detail: validation.error });
    }

    const { profile, result } = req.body;
    const persona = validation.sanitizedPersona;

    // Dynamically retrieve client from environment or fallback
    const ai = getAIClient();

    // Graceful fallback if Gemini AI is not initialized
    if (!ai) {
      const fallbackData = generateHeuristicRecommendations(profile, result, persona);
      return res.json(fallbackData);
    }

    const personaInstructions = {
      strategist: "You are an Elite Career Strategist focusing on long-term trajectory, company tier positioning, and competitive edge.",
      interviewer: "You are a Senior Technical Interviewer providing tactical round-by-round interview advice, coding test strategies, and system design defense.",
      mentor: "You are a Compassionate Academic Mentor focusing on sustainable preparation, mindset, holistic skill-building, and stress management."
    }[persona];

    const prompt = `
${personaInstructions}

Analyze this engineering student's profile for college placements:
- Branch: ${profile.branch || 'Engineering'}
- Current Year: ${profile.year || 'Final Year'}
- CGPA: ${profile.cgpa} / 10
- Active Backlogs: ${profile.backlogs}
- Internships: ${profile.internships} (Relevance: ${profile.internshipRelevance}/10)
- Projects: ${profile.projects} (Complexity: ${profile.projectComplexity}/10, Docs: ${profile.projectDocumentation}/10)
- Technical Scores: Coding DSA (${profile.codingDSA}/100), Development (${profile.codingDev}/100), Aptitude (${profile.aptitudeScore}/100), Communication (${profile.communicationScore}/10)
- Estimated Placement Readiness: ${(result.probability * 100).toFixed(1)}%

Provide realistic, actionable recommendations. Do not promise guaranteed hiring.
Provide response matching the required schema.
`;

    const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash";

    const generatePromise = ai.models.generateContent({
      model: modelName,
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

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API request timeout (9s)")), 9000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed.analysis || !Array.isArray(parsed.tips)) {
      throw new Error("Invalid schema received from AI model");
    }

    return res.json(parsed);
  } catch (err) {
    // Structured error handling without leaking raw secrets or stack traces
    console.error("Recommendations processing error:", err?.message || err);
    // Provide safe heuristic fallback response on upstream error
    const { profile, result, persona } = req.body || {};
    if (profile && result) {
      return res.json(generateHeuristicRecommendations(profile, result, persona || "strategist"));
    }
    return res.status(500).json({
      error: "Service Error",
      message: "An error occurred while generating recommendations. Please try again.",
    });
  }
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: `Route ${req.method} ${req.path} not found` });
});

const port = process.env.PORT || 5050;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Placeltyics Backend API running on http://localhost:${port}`);
  });
}

export default app;

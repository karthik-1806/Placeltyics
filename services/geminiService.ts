import { StudentProfile, PredictionResult } from "../types";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:5050");

export interface RecommendationResponse {
  analysis: string;
  tips: Array<{
    category: string;
    priority: "High" | "Medium" | "Low" | string;
    tip: string;
  }>;
  idealCompanies: string[];
}

/**
 * Deterministic client-side heuristic fallback when backend is unreachable or times out.
 */
function getClientHeuristicFallback(
  profile: StudentProfile,
  result: PredictionResult,
  persona: string = "strategist"
): RecommendationResponse {
  const probPercent = Math.round(result.probability * 100);
  const isHighReady = probPercent >= 75;
  const hasBacklogs = profile.backlogs > 0;

  if (persona === "interviewer") {
    return {
      analysis: `Technical Interview Assessment: Profile indicates ${profile.codingDSA}% DSA capability and ${profile.projects} completed project(s). To excel in Tier-1 technical rounds, practice explaining your code aloud while writing it and prepare in-depth architecture explanations for your primary portfolio projects.`,
      tips: [
        {
          category: "Live Coding Defense",
          priority: profile.codingDSA < 75 ? "High" : "Medium",
          tip: "Practice the 45-minute live interview format: 5 min problem clarification, 10 min brute-force & complexity analysis, 20 min clean implementation, 10 min edge testing."
        },
        {
          category: "System & Architecture Defense",
          priority: "High",
          tip: "Be prepared to explain database indexing, API rate limiting, and trade-offs made in your primary project."
        },
        {
          category: "Behavioral Alignment",
          priority: "Medium",
          tip: "Structure leadership and conflict responses strictly using the STAR technique (Situation, Task, Action, Result)."
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
          category: "Study Cadence",
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

export const getSmartRecommendations = async (
  profile: StudentProfile,
  result: PredictionResult,
  persona: string = "strategist"
): Promise<RecommendationResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second client timeout

    const res = await fetch(`${API_BASE}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, result, persona }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[getSmartRecommendations] Server returned status ${res.status}. Using heuristic fallback.`);
      return getClientHeuristicFallback(profile, result, persona);
    }

    const data = await res.json();
    if (!data || !data.analysis || !Array.isArray(data.tips)) {
      console.warn("[getSmartRecommendations] Invalid payload structure received. Using heuristic fallback.");
      return getClientHeuristicFallback(profile, result, persona);
    }

    return data as RecommendationResponse;
  } catch (error: any) {
    console.warn("[getSmartRecommendations] Network/Timeout error, engaging client heuristic fallback:", error?.message || error);
    return getClientHeuristicFallback(profile, result, persona);
  }
};

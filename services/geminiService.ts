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

export const getSmartRecommendations = async (
  profile: StudentProfile,
  result: PredictionResult,
  persona: string = "strategist"
): Promise<RecommendationResponse | null> => {
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
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || err?.error || `Request failed with status ${res.status}`);
    }

    const data = await res.json();
    return data as RecommendationResponse;
  } catch (error: any) {
    console.error("Placement Coach Service Error:", error?.message || error);
    return null;
  }
};

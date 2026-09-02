import { StudentProfile, PredictionResult } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

export const getSmartRecommendations = async (
  profile: StudentProfile,
  result: PredictionResult
) => {
  try {
    const res = await fetch(`${API_BASE}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, result }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Backend request failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Backend Error:", error);
    return null;
  }
};

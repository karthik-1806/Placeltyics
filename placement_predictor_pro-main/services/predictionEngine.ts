
import { StudentProfile, PredictionResult } from '../types';
import { FEATURE_WEIGHTS, ELIGIBILITY_THRESHOLDS } from '../constants';

/**
 * Sanitizes profile data before calculation to ensure mathematical stability.
 */
const sanitizeProfile = (profile: StudentProfile): StudentProfile => {
  return {
    ...profile,
    cgpa: Math.min(Math.max(profile.cgpa, 0), 10),
    codingDSA: Math.min(Math.max(profile.codingDSA, 0), 100),
    codingDev: Math.min(Math.max(profile.codingDev, 0), 100),
    aptitudeScore: Math.min(Math.max(profile.aptitudeScore, 0), 100),
    communicationScore: Math.min(Math.max(profile.communicationScore, 0), 10),
    internships: Math.min(Math.max(profile.internships, 0), 10),
    projects: Math.min(Math.max(profile.projects, 0), 20),
    backlogs: Math.min(Math.max(profile.backlogs, 0), 10)
  };
};

/**
 * Applies Platt Scaling (Logistic Calibration) to a raw decision value.
 * coefficients derived from the Python training script (train_model.py).
 */
const calibrateProbability = (decisionValue: number): number => {
  // Platt Scaling coefficients: P(y=1|f) = 1 / (1 + exp(A*f + B))
  // Where f is our weighted decision value normalized to [-1, 1]
  const A = -10.24; // Scale parameter
  const B = 0.85;   // Bias parameter
  
  // Transform decision value into a probability range
  const prob = 1 / (1 + Math.exp(A * (decisionValue - 0.5) + B));
  
  return Math.min(Math.max(prob, 0.01), 0.99);
};

export const calculatePlacementProb = (rawProfile: StudentProfile): PredictionResult => {
  const profile = sanitizeProfile(rawProfile);
  let eligibility: PredictionResult['eligibilityStatus'] = 'EL_HIGH';
  const feedback: string[] = [];

  // 1. Eligibility Guardrails (Decision Gate)
  if (profile.backlogs > ELIGIBILITY_THRESHOLDS.BACKLOGS_MAX) {
    eligibility = 'INELIGIBLE';
    feedback.push(`Critical: Your ${profile.backlogs} backlogs violate industry standards. Focus on clearing these before applying.`);
  } else if (profile.backlogs > 0) {
    eligibility = 'EL_LOW';
    feedback.push("Alert: Single backlog detected. Many 'Super Dream' companies will auto-filter this profile.");
  }

  if (profile.cgpa < ELIGIBILITY_THRESHOLDS.CGPA_MIN) {
    eligibility = eligibility === 'INELIGIBLE' ? 'INELIGIBLE' : 'EL_LOW';
    feedback.push(`Risk: CGPA (${profile.cgpa}) is below 6.0 threshold. You are currently filtered out of Mass Recruitment pools.`);
  } else if (profile.cgpa < 7.5) {
    if (eligibility === 'EL_HIGH') eligibility = 'EL_MEDIUM';
    feedback.push("Improvement: Boost CGPA above 7.5 to unlock Tier-1 product roles.");
  }

  // 2. Feature Vector Weighting
  const technicalScore = (0.7 * profile.codingDSA + 0.3 * profile.codingDev);
  const internshipScore = (profile.internships * 10) * (profile.internshipRelevance / 10);
  const projectScore = (profile.projects * 8) * (profile.projectComplexity / 10) * (1 + profile.projectDocumentation / 20);
  const profileStrength = Math.min((internshipScore + projectScore), 50) / 50;

  const weights = [
    (profile.cgpa / 10) * FEATURE_WEIGHTS.CGPA,
    (technicalScore / 100) * FEATURE_WEIGHTS.CODING_SCORE,
    (profile.aptitudeScore / 100) * FEATURE_WEIGHTS.APTITUDE_SCORE,
    (profile.communicationScore / 10) * FEATURE_WEIGHTS.COMMUNICATION,
    profileStrength * FEATURE_WEIGHTS.PROFILE_STRENGTH
  ];

  const totalPossibleWeight = (
    FEATURE_WEIGHTS.CGPA + 
    FEATURE_WEIGHTS.CODING_SCORE + 
    FEATURE_WEIGHTS.APTITUDE_SCORE + 
    FEATURE_WEIGHTS.COMMUNICATION + 
    FEATURE_WEIGHTS.PROFILE_STRENGTH
  );

  let rawScore = weights.reduce((a, b) => a + b, 0) / totalPossibleWeight;

  // 3. Calibration (Platt Scaling)
  const calibratedProb = calibrateProbability(rawScore);

  // 4. Actionable Advice Construction
  if (profile.aptitudeScore < 60 && calibratedProb < 0.7) {
    feedback.push("Strategic Tip: Focus on quantitative aptitude; your profile is strong, but initial filtering tests might be a bottleneck.");
  }
  
  if (profile.codingDSA < 50 && profile.codingDev > 70) {
    feedback.push("Action Required: Strong dev skills, but low DSA score. Tier-1 rounds heavily favor competitive programming.");
  }
  
  if (profile.projectDocumentation < 5 && profile.projects > 2) {
    feedback.push("Optimization: Your project count is good, but low documentation quality might hurt you during resume reviews.");
  }

  if (feedback.length === 0) {
    feedback.push(calibratedProb > 0.8 ? "Profile is in the optimal range for elite placements." : "Profile is competitive for most general recruitment drives.");
  }

  return {
    probability: calibratedProb,
    isPlaced: calibratedProb >= 0.5,
    eligibilityStatus: eligibility,
    message: feedback.join(" "),
    scoreBreakdown: {
      academic: (profile.cgpa / 10) * 100,
      technical: technicalScore,
      profile: profileStrength * 100,
      softSkills: profile.communicationScore * 10
    }
  };
};

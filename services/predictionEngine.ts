import { StudentProfile, PredictionResult, CompanyEligibility } from '../types';
import { FEATURE_WEIGHTS, ELIGIBILITY_THRESHOLDS } from '../constants';

/**
 * Sanitizes profile data before calculation to ensure mathematical stability and valid numerical bounds.
 */
export const sanitizeProfile = (profile: StudentProfile): StudentProfile => {
  return {
    ...profile,
    cgpa: Math.min(Math.max(Number(profile.cgpa) || 0, 0), 10),
    codingDSA: Math.min(Math.max(Number(profile.codingDSA) || 0, 0), 100),
    codingDev: Math.min(Math.max(Number(profile.codingDev) || 0, 0), 100),
    aptitudeScore: Math.min(Math.max(Number(profile.aptitudeScore) || 0, 0), 100),
    communicationScore: Math.min(Math.max(Number(profile.communicationScore) || 0, 0), 10),
    internships: Math.min(Math.max(Number(profile.internships) || 0, 0), 10),
    internshipRelevance: Math.min(Math.max(Number(profile.internshipRelevance) || 0, 0), 10),
    projects: Math.min(Math.max(Number(profile.projects) || 0, 0), 20),
    projectComplexity: Math.min(Math.max(Number(profile.projectComplexity) || 0, 0), 10),
    projectDocumentation: Math.min(Math.max(Number(profile.projectDocumentation) || 0, 0), 10),
    backlogs: Math.min(Math.max(Number(profile.backlogs) || 0, 0), 20)
  };
};

/**
 * Applies calibrated Platt Scaling (logistic sigmoid) to the combined decision value.
 * Note: Model calibrated against benchmark criteria; outputs a heuristic readiness estimate.
 */
const calibrateProbability = (decisionValue: number, backlogCount: number): number => {
  // Platt Scaling coefficients: P(y=1|f) = 1 / (1 + exp(A * (f - 0.5) + B))
  const A = -8.5; // Moderated scale parameter for smoother transitions
  const B = 0.45; // Bias parameter

  let prob = 1 / (1 + Math.exp(A * (decisionValue - 0.5) + B));

  // If student has active backlogs, apply progressive penalty
  if (backlogCount > 0) {
    const backlogDampener = Math.max(0.2, 1 - (backlogCount * 0.25));
    prob = prob * backlogDampener;
  }

  // Bound probability safely between 5% and 98%
  return Math.min(Math.max(Math.round(prob * 1000) / 1000, 0.05), 0.98);
};

/**
 * Evaluates company-specific eligibility thresholds based on real-world hiring patterns.
 */
export const evaluateCompanyEligibility = (profile: StudentProfile): CompanyEligibility[] => {
  const technicalScore = 0.7 * profile.codingDSA + 0.3 * profile.codingDev;

  const benchmarkCompanies = [
    {
      name: 'Amazon / Microsoft',
      category: 'Product / Super Dream' as const,
      minCgpa: 7.5,
      maxBacklogs: 0,
      minTechScore: 75,
    },
    {
      name: 'TCS Digital / Infosys (PP)',
      category: 'Tier-1 Specialist' as const,
      minCgpa: 7.0,
      maxBacklogs: 0,
      minTechScore: 65,
    },
    {
      name: 'Accenture / Cognizant / TCS Ninja',
      category: 'Mass / IT Services' as const,
      minCgpa: 6.0,
      maxBacklogs: 1,
      minTechScore: 50,
    },
  ];

  return benchmarkCompanies.map((comp) => {
    let status: CompanyEligibility['status'] = 'ELIGIBLE';
    const reasons: string[] = [];

    if (profile.backlogs > comp.maxBacklogs) {
      status = 'INELIGIBLE';
      reasons.push(`${profile.backlogs} active backlogs exceed maximum allowed (${comp.maxBacklogs})`);
    }

    if (profile.cgpa < comp.minCgpa) {
      if (comp.minCgpa - profile.cgpa <= 0.3 && status !== 'INELIGIBLE') {
        status = 'NEAR_THRESHOLD';
        reasons.push(`CGPA (${profile.cgpa}) is near cutoff (${comp.minCgpa})`);
      } else {
        status = 'INELIGIBLE';
        reasons.push(`CGPA (${profile.cgpa}) below cutoff (${comp.minCgpa})`);
      }
    }

    if (technicalScore < comp.minTechScore) {
      if (comp.minTechScore - technicalScore <= 10 && status !== 'INELIGIBLE') {
        status = 'NEAR_THRESHOLD';
        reasons.push(`Tech score (${Math.round(technicalScore)}%) needs modest improvement to reach ${comp.minTechScore}%`);
      } else if (status !== 'INELIGIBLE') {
        status = 'INELIGIBLE';
        reasons.push(`Tech score (${Math.round(technicalScore)}%) is below expected standard (${comp.minTechScore}%)`);
      }
    }

    const reason = reasons.length > 0
      ? reasons.join('; ')
      : `Profile satisfies criteria for ${comp.category}`;

    return {
      ...comp,
      status,
      reason,
    };
  });
};

/**
 * Calculates a multi-dimensional placement readiness estimate with transparent score components.
 */
export const calculatePlacementProb = (rawProfile: StudentProfile): PredictionResult => {
  const profile = sanitizeProfile(rawProfile);
  let eligibility: PredictionResult['eligibilityStatus'] = 'EL_HIGH';
  const feedback: string[] = [];

  // 1. Eligibility Guardrails
  if (profile.backlogs > ELIGIBILITY_THRESHOLDS.BACKLOGS_MAX) {
    eligibility = 'INELIGIBLE';
    feedback.push(`Critical: ${profile.backlogs} active backlogs restrict campus recruitment eligibility across most hiring partners.`);
  } else if (profile.backlogs > 0) {
    eligibility = 'EL_LOW';
    feedback.push("Notice: 1 active backlog detected. Product & Tier-1 firms will typically screen out this profile until cleared.");
  }

  if (profile.cgpa < ELIGIBILITY_THRESHOLDS.CGPA_MIN) {
    eligibility = 'INELIGIBLE';
    feedback.push(`Alert: CGPA (${profile.cgpa.toFixed(2)}) is below the standard 6.0 cutoff for most campus drives.`);
  } else if (profile.cgpa < 7.5 && eligibility === 'EL_HIGH') {
    eligibility = 'EL_MEDIUM';
    feedback.push("Target: Elevating CGPA above 7.5 will unlock high-tier product company shortlisting.");
  }

  // 2. Multi-Vector Scoring
  // Technical: 70% DSA + 30% Development
  const technicalScore = Math.min(100, Math.max(0, 0.7 * profile.codingDSA + 0.3 * profile.codingDev));

  // Profile strength: Internships (relevance scaled) + Projects (complexity & docs scaled)
  const internshipPoints = Math.min(50, profile.internships * 12 * (profile.internshipRelevance / 10));
  const projectPoints = Math.min(
    50,
    profile.projects * 10 * (profile.projectComplexity / 10) * (0.7 + (profile.projectDocumentation / 10) * 0.3)
  );
  const profileStrength = Math.min(100, internshipPoints + projectPoints);

  // Academic normalized
  const academicScore = Math.min(100, (profile.cgpa / 10) * 100);

  // Soft Skills normalized
  const softSkillsScore = Math.min(100, profile.communicationScore * 10);

  // Weighted calculation
  const weightedSum =
    (academicScore / 100) * FEATURE_WEIGHTS.CGPA +
    (technicalScore / 100) * FEATURE_WEIGHTS.CODING_SCORE +
    (profile.aptitudeScore / 100) * FEATURE_WEIGHTS.APTITUDE_SCORE +
    (softSkillsScore / 100) * FEATURE_WEIGHTS.COMMUNICATION +
    (profileStrength / 100) * FEATURE_WEIGHTS.PROFILE_STRENGTH;

  const totalPossibleWeight =
    FEATURE_WEIGHTS.CGPA +
    FEATURE_WEIGHTS.CODING_SCORE +
    FEATURE_WEIGHTS.APTITUDE_SCORE +
    FEATURE_WEIGHTS.COMMUNICATION +
    FEATURE_WEIGHTS.PROFILE_STRENGTH;

  const rawDecisionValue = weightedSum / totalPossibleWeight;

  // 3. Calibrate Probability (Logistic curve + backlog adjustments)
  const calibratedProb = calibrateProbability(rawDecisionValue, profile.backlogs);

  // 4. Actionable Diagnostic Tips
  if (profile.codingDSA < 60) {
    feedback.push("DSA Priority: Coding round performance is currently the primary bottleneck. Focus on standard LeetCode Patterns.");
  }
  if (profile.aptitudeScore < 60 && calibratedProb >= 0.6) {
    feedback.push("Aptitude Caution: Strong technical profile, but initial online assessment (OA) filtering tests may pose a risk.");
  }
  if (profile.internships === 0 && profile.projects < 2) {
    feedback.push("Practical Gap: Target completing at least 1 industry internship or 2 full-stack deployed portfolio projects.");
  }

  if (feedback.length === 0) {
    feedback.push(
      calibratedProb >= 0.8
        ? "Excellent profile balance across academics, algorithms, and practical engineering experience."
        : "Consistent foundational profile; steady preparation across core areas will sustain your placement readiness."
    );
  }

  // 5. Readiness Classification Label
  let readinessLabel = "Developing Foundation";
  if (profile.backlogs > 1 || profile.cgpa < 5.5) {
    readinessLabel = "Intervention Required";
  } else if (calibratedProb >= 0.82) {
    readinessLabel = "Optimal Readiness";
  } else if (calibratedProb >= 0.68) {
    readinessLabel = "Competitive Candidate";
  } else if (calibratedProb >= 0.50) {
    readinessLabel = "Developing Foundation";
  } else {
    readinessLabel = "Focus Needed";
  }

  const companyEligibility = evaluateCompanyEligibility(profile);

  return {
    probability: calibratedProb,
    isPlaced: calibratedProb >= 0.5 && profile.backlogs <= 1 && profile.cgpa >= 6.0,
    eligibilityStatus: eligibility,
    readinessLabel,
    message: feedback.join(" "),
    scoreBreakdown: {
      academic: Math.round(academicScore),
      technical: Math.round(technicalScore),
      profile: Math.round(profileStrength),
      softSkills: Math.round(softSkillsScore)
    },
    companyEligibility
  };
};

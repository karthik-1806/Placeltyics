export interface UserInfo {
  name: string;
  email: string;
  university: string;
  avatar?: string;
  careerGoal: string;
}

export interface PredictionRecord {
  timestamp: number;
  probability: number;
}

export interface StudentProfile {
  user: UserInfo;
  year: string;
  branch: string;
  cgpa: number;
  internships: number;
  internshipRelevance: number; // 0-10
  projects: number;
  projectComplexity: number; // 0-10
  projectDocumentation: number; // 0-10
  backlogs: number;
  aptitudeScore: number;
  communicationScore: number;
  codingDSA: number; // Factorized coding: Data Structures
  codingDev: number; // Factorized coding: Development/Frameworks
  predictionHistory: PredictionRecord[];
}

export interface CompanyEligibility {
  name: string;
  category: 'Product / Super Dream' | 'Tier-1 Specialist' | 'Mass / IT Services';
  minCgpa: number;
  maxBacklogs: number;
  minTechScore: number;
  status: 'ELIGIBLE' | 'NEAR_THRESHOLD' | 'INELIGIBLE';
  reason: string;
}

export interface PredictionResult {
  probability: number;
  isPlaced: boolean;
  scoreBreakdown: {
    academic: number;
    technical: number;
    profile: number;
    softSkills: number;
  };
  eligibilityStatus: 'EL_HIGH' | 'EL_MEDIUM' | 'EL_LOW' | 'INELIGIBLE';
  message: string;
  readinessLabel: string;
  companyEligibility: CompanyEligibility[];
}

export interface Recommendation {
  category: 'Coding' | 'Academic' | 'Project' | 'Soft Skills';
  priority: 'High' | 'Medium' | 'Low';
  tip: string;
}

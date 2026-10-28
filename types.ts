
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
}

export interface Recommendation {
  category: 'Coding' | 'Academic' | 'Project' | 'Soft Skills';
  priority: 'High' | 'Medium' | 'Low';
  tip: string;
}


export const FEATURE_WEIGHTS = {
  CODING_SCORE: 2.2,
  APTITUDE_SCORE: 2.0,
  CGPA: 1.4,
  SKILL_SCORE: 1.8,
  PROFILE_STRENGTH: 1.2,
  COMMUNICATION: 1.0,
  BACKLOG_PENALTY: 1.5
};

export const ELIGIBILITY_THRESHOLDS = {
  CGPA_MIN: 6.0,
  BACKLOGS_MAX: 1,
  APTITUDE_MIN: 50
};

// Expanded options to demonstrate varying durations
export const BRANCH_OPTIONS = [
  'B.Tech (CSE)',
  'B.Tech (IT)',
  'B.Tech (ECE)',
  'B.Tech (ME)',
  'B.Tech (CE)',
  'BCA',
  'MCA',
  'M.Tech'
];

// Mapping branches to their respective total years of study
export const COURSE_CONFIG: Record<string, { duration: number }> = {
  'B.Tech (CSE)': { duration: 4 },
  'B.Tech (IT)': { duration: 4 },
  'B.Tech (ECE)': { duration: 4 },
  'B.Tech (ME)': { duration: 4 },
  'B.Tech (CE)': { duration: 4 },
  'BCA': { duration: 3 },
  'MCA': { duration: 2 },
  'M.Tech': { duration: 2 }
};

export const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
];

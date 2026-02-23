/**
 * CV type definitions
 */

/**
 * Work history entry for CV
 */
export interface WorkHistoryEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  highlights: string[];
  location?: string;
  badges?: string[];
}

/**
 * Education entry for CV
 */
export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

/**
 * Management skill for pie chart visualization
 */
export interface ManagementSkill {
  id: string;
  name: string;
  percentage: number;
  color?: string;
}

/**
 * CV data structure
 */
export interface CVData {
  id: string;
  skills: string[];
  workHistory: WorkHistoryEntry[];
  education: EducationEntry[];
  managementSkills: ManagementSkill[];
  pdfFileName?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Public CV data (subset for public display)
 */
export interface PublicCVData {
  skills: string[];
  workHistory: WorkHistoryEntry[];
  education: EducationEntry[];
  managementSkills: ManagementSkill[];
  downloadUrl?: string;
}

/**
 * Parse result from PDF
 */
export interface CVParseResult {
  success: boolean;
  message: string;
  data?: {
    skills: string[];
    workHistory: WorkHistoryEntry[];
    education: EducationEntry[];
  };
  warnings?: string[];
}

/**
 * CV error codes enumeration
 */
export enum CVErrorCode {
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  PASSWORD_PROTECTED = 'PASSWORD_PROTECTED',
  CORRUPTED_PDF = 'CORRUPTED_PDF',
  PARSING_TIMEOUT = 'PARSING_TIMEOUT',
  PARSING_FAILED = 'PARSING_FAILED',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  CV_NOT_FOUND = 'CV_NOT_FOUND',
  UPLOAD_IN_PROGRESS = 'UPLOAD_IN_PROGRESS',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

/**
 * Skill type definitions
 */

/**
 * Skill category types
 */
export type SkillCategory = 'technical' | 'leadership' | 'management';

/**
 * Skill interface
 */
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1-100
  yearsOfExperience?: number;
  icon?: string;
}

/**
 * Work experience interface
 */
export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  highlights: string[];
  location?: string;
}

/**
 * Site configuration
 */
export interface SiteConfig {
  ownerName: string;
  title: string;
  description: string;
  cvUrl: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email: string;
  };
  skills: Skill[];
  workExperience: WorkExperience[];
}

/**
 * Profile type definitions for CV header/personal info
 */

/**
 * Contact information structure
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

/**
 * Profile data for CV header section
 */
export interface ProfileData {
  id: string;
  name: string;
  title: string;
  summary: string;
  location?: string;
  locationUrl?: string;
  profileImageUrl?: string;
  contacts: ContactInfo;
  createdAt: string;
  updatedAt: string;
}

/**
 * Public profile data (for display)
 */
export interface PublicProfileData {
  name: string;
  title: string;
  summary: string;
  location?: string;
  locationUrl?: string;
  profileImageUrl?: string;
  contacts: ContactInfo;
}

/**
 * Update profile input
 */
export interface UpdateProfileInput {
  name: string;
  title: string;
  summary: string;
  location?: string;
  locationUrl?: string;
  contacts: ContactInfo;
}

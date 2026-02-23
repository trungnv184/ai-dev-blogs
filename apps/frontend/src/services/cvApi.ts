import { api } from './api';

// Helper function to handle API errors
function handleApiError(error: unknown, defaultMessage: string): never {
  if (error instanceof Error) {
    const axiosError = error as {
      code?: string;
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };

    // Network error (no response from server)
    if (axiosError.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your internet connection and try again.');
    }

    // Timeout error
    if (axiosError.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }

    // Server responded with an error
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }

    // Server error without message
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
  }

  throw new Error(defaultMessage);
}

// Types
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

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface ManagementSkill {
  id: string;
  name: string;
  percentage: number;
}

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

export interface PublicCVData {
  skills: string[];
  workHistory: WorkHistoryEntry[];
  education: EducationEntry[];
  managementSkills: ManagementSkill[];
  downloadUrl?: string;
}

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

export interface UpdateCVData {
  skills: string[];
  workHistory: WorkHistoryEntry[];
  education?: EducationEntry[];
}

export interface UpdateManagementSkillsData {
  skills: Array<{
    id?: string;
    name: string;
    percentage: number;
  }>;
}

// API Functions

export async function uploadCV(file: File): Promise<CVParseResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<{ success: boolean; data: CVParseResult }>('/cv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // The response is wrapped by the global interceptor, extract the inner data
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Upload failed. Please try again.');
  }
}

export async function getCV(): Promise<{ success: boolean; data: CVData | null }> {
  try {
    const response = await api.get<{ success: boolean; data: CVData | null }>('/cv');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to load CV data. Please try again.');
  }
}

export async function updateCV(data: UpdateCVData): Promise<{ success: boolean; data: CVData; message: string }> {
  try {
    const response = await api.put<{ success: boolean; data: CVData; message: string }>('/cv', data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to save CV. Please try again.');
  }
}

export async function publishCV(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post<{ success: boolean; message: string }>('/cv/publish');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to publish CV. Please try again.');
  }
}

export async function unpublishCV(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post<{ success: boolean; message: string }>('/cv/unpublish');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to unpublish CV. Please try again.');
  }
}

export async function getManagementSkills(): Promise<{ success: boolean; data: ManagementSkill[] }> {
  try {
    const response = await api.get<{ success: boolean; data: ManagementSkill[] }>('/cv/management-skills');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to load management skills. Please try again.');
  }
}

export async function updateManagementSkills(
  data: UpdateManagementSkillsData
): Promise<{ success: boolean; data: ManagementSkill[]; message: string }> {
  try {
    const response = await api.put<{ success: boolean; data: ManagementSkill[]; message: string }>(
      '/cv/management-skills',
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to save management skills. Please try again.');
  }
}

export async function getPublicCV(): Promise<{ success: boolean; data: PublicCVData | null }> {
  try {
    const response = await api.get<{ success: boolean; data: PublicCVData | null }>('/cv/public');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to load CV. Please try again.');
  }
}

export function getDownloadUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL || '/api';
  return `${baseUrl}/cv/download`;
}

// Profile types
export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

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

export interface PublicProfileData {
  name: string;
  title: string;
  summary: string;
  location?: string;
  locationUrl?: string;
  profileImageUrl?: string;
  contacts: ContactInfo;
}

export interface UpdateProfileData {
  name: string;
  title: string;
  summary: string;
  location?: string;
  locationUrl?: string;
  contacts: ContactInfo;
}

// Profile API Functions

export async function getProfile(): Promise<{ success: boolean; data: ProfileData | null }> {
  try {
    const response = await api.get<{ success: boolean; data: ProfileData | null }>('/cv/profile');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to load profile data. Please try again.');
  }
}

export async function updateProfile(
  data: UpdateProfileData
): Promise<{ success: boolean; data: ProfileData; message: string }> {
  try {
    const response = await api.put<{ success: boolean; data: ProfileData; message: string }>(
      '/cv/profile',
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to save profile. Please try again.');
  }
}

export async function uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await api.post<{ success: boolean; data: { imageUrl: string } }>(
      '/cv/profile/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Failed to upload profile image. Please try again.');
  }
}

export async function getPublicProfile(): Promise<{ success: boolean; data: PublicProfileData | null }> {
  try {
    const response = await api.get<{ success: boolean; data: PublicProfileData | null }>(
      '/cv/profile/public'
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to load profile. Please try again.');
  }
}

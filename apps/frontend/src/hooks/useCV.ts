import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCV,
  updateCV,
  uploadCV,
  publishCV,
  unpublishCV,
  getManagementSkills,
  updateManagementSkills,
  getPublicCV,
  getProfile,
  updateProfile,
  uploadProfileImage,
  getPublicProfile,
  CVData,
  ManagementSkill,
  PublicCVData,
  UpdateCVData,
  UpdateManagementSkillsData,
  CVParseResult,
  ProfileData,
  PublicProfileData,
  UpdateProfileData,
} from '../services/cvApi';

// Query keys
export const cvKeys = {
  all: ['cv'] as const,
  admin: () => [...cvKeys.all, 'admin'] as const,
  public: () => [...cvKeys.all, 'public'] as const,
  managementSkills: () => [...cvKeys.all, 'management-skills'] as const,
  profile: () => [...cvKeys.all, 'profile'] as const,
  profilePublic: () => [...cvKeys.all, 'profile-public'] as const,
};

// Admin CV data hook
export function useCV() {
  return useQuery({
    queryKey: cvKeys.admin(),
    queryFn: async (): Promise<CVData | null> => {
      const response = await getCV();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Public CV data hook
export function usePublicCV() {
  return useQuery({
    queryKey: cvKeys.public(),
    queryFn: async (): Promise<PublicCVData | null> => {
      const response = await getPublicCV();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Management skills hook
export function useManagementSkills() {
  return useQuery({
    queryKey: cvKeys.managementSkills(),
    queryFn: async (): Promise<ManagementSkill[]> => {
      const response = await getManagementSkills();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// CV mutations hook
export function useCVMutations() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File): Promise<CVParseResult> => uploadCV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.admin() });
      queryClient.invalidateQueries({ queryKey: cvKeys.public() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCVData) => updateCV(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.admin() });
      queryClient.invalidateQueries({ queryKey: cvKeys.public() });
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => publishCV(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.admin() });
      queryClient.invalidateQueries({ queryKey: cvKeys.public() });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: () => unpublishCV(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.admin() });
      queryClient.invalidateQueries({ queryKey: cvKeys.public() });
    },
  });

  const updateSkillsMutation = useMutation({
    mutationFn: (data: UpdateManagementSkillsData) => updateManagementSkills(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.managementSkills() });
      queryClient.invalidateQueries({ queryKey: cvKeys.public() });
    },
  });

  return {
    upload: uploadMutation,
    update: updateMutation,
    publish: publishMutation,
    unpublish: unpublishMutation,
    updateSkills: updateSkillsMutation,
  };
}

// Admin profile data hook
export function useProfile() {
  return useQuery({
    queryKey: cvKeys.profile(),
    queryFn: async (): Promise<ProfileData | null> => {
      const response = await getProfile();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Public profile data hook
export function usePublicProfile() {
  return useQuery({
    queryKey: cvKeys.profilePublic(),
    queryFn: async (): Promise<PublicProfileData | null> => {
      const response = await getPublicProfile();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Profile mutations hook
export function useProfileMutations() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.profile() });
      queryClient.invalidateQueries({ queryKey: cvKeys.profilePublic() });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.profile() });
      queryClient.invalidateQueries({ queryKey: cvKeys.profilePublic() });
    },
  });

  return {
    update: updateMutation,
    uploadImage: uploadImageMutation,
  };
}

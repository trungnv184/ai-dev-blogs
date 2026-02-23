import { useMutation } from '@tanstack/react-query';
import api from '../services/api';

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export function useContact() {
  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await api.post('/contact', data);
      return response.data;
    },
  });

  return {
    submitContact: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}

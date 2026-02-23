import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category?: {
    name: string;
    slug: string;
  };
  publishedAt?: string;
  readingTime: number;
}

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async (): Promise<Post[]> => {
      if (searchTerm.length < 2) return [];
      const response = await api.get(`/posts?search=${encodeURIComponent(searchTerm)}&published=true`);
      return response.data.data.data;
    },
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const search = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    results: data || [],
    isSearching: isLoading,
    search,
    searchTerm,
  };
}

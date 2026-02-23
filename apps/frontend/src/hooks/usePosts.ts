import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  published: boolean;
  publishedAt?: string;
  readingTime: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PostsResponse {
  data: Post[];
  meta: PaginationMeta;
}

interface UsePostsOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  published?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { page = 1, limit = 10, category, search, published = true } = options;

  return useQuery({
    queryKey: ['posts', { page, limit, category, search, published }],
    queryFn: async (): Promise<PostsResponse> => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      params.append('published', String(published));

      const response = await api.get(`/posts?${params.toString()}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async (): Promise<Post> => {
      const response = await api.get(`/posts/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePostById(id: string) {
  return useQuery({
    queryKey: ['post-by-id', id],
    queryFn: async (): Promise<Post> => {
      const response = await api.get(`/posts/by-id/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'new',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

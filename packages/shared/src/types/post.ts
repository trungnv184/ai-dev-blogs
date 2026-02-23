/**
 * Category interface for blog post categorization
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

/**
 * Complete Post interface with all fields
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: Category;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  readingTime: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PostSummary type for list views (without full content)
 */
export type PostSummary = Omit<Post, 'content'>;

/**
 * Create post input
 */
export interface CreatePostInput {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  categoryId: string;
  tags: string[];
  published?: boolean;
}

/**
 * Update post input
 */
export interface UpdatePostInput extends Partial<CreatePostInput> {}

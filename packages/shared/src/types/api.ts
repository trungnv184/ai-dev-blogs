/**
 * API response type definitions
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
  path?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * API error type for error handling
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
}

/**
 * Query parameters for paginated list endpoints
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Query parameters for posts list
 */
export interface PostsQueryParams extends PaginationParams {
  category?: string;
  search?: string;
  published?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Standard API Response matching the backend's TransformInterceptor
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/**
 * Dynamic helper for paginated array responses 
 * (guarantees data is an array of T and meta exists)
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Standard Error Response from NestJS exception filters
 */
export interface ApiErrorResponse {
  success: false;
  message: string | string[]; // NestJS class-validator can return an array of messages
  error?: string;
  statusCode: number;
}

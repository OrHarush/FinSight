export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

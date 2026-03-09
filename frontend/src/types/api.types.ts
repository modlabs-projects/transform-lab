export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}

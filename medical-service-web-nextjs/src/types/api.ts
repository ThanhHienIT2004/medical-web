export type ApiResponseShape<T> = {
  statusCode: number;
  success: boolean;
  data: T | null;
  message: string;
  timestamp: string;
  path: string;
};


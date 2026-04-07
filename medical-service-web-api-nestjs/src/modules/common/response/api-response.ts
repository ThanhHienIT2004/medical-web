export interface ApiResponseShape<T> {
  statusCode: number;
  success: boolean;
  data: T | null;
  message: string;
  timestamp: string;
  path: string;
}

export class ApiResponse {
  static success<T>(
    data: T,
    message: string,
    statusCode: number = 200,
    path: string = '',
  ): ApiResponseShape<T> {
    return {
      statusCode,
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  static error(
    statusCode: number,
    message: string,
    path: string = '',
  ): ApiResponseShape<null> {
    return {
      statusCode,
      success: false,
      data: null,
      message,
      timestamp: new Date().toISOString(),
      path,
    };
  }
}

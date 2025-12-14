// Error handling utilities for API responses

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

// Custom error class for API errors
export class ApiException extends Error {
  public status?: number;
  public code?: string;
  public details?: unknown;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Error handler utility
export const handleApiError = (error: unknown): ApiError => {
  // Type guard for axios errors
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as {
      response: {
        status: number;
        data?: { message?: string; code?: string; details?: unknown };
      };
    };
    const { status, data } = axiosError.response;
    return {
      message: data?.message || "An error occurred",
      status,
      code: data?.code,
      details: data?.details,
    };
  } else if (
    typeof error === "object" &&
    error !== null &&
    "request" in error
  ) {
    // Request was made but no response received
    return {
      message: "Network error - please check your connection",
      status: 0,
      code: "NETWORK_ERROR",
    };
  } else {
    // Something else happened
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      message: errorMessage,
      code: "UNKNOWN_ERROR",
    };
  }
};

// Error messages mapping
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  UNAUTHORIZED:
    "You are not authorized to perform this action. Please log in again.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  RATE_LIMIT: "Too many requests. Please wait before trying again.",
} as const;

// Get user-friendly error message
export const getErrorMessage = (error: ApiError): string => {
  if (error.code && error.code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES];
  }

  switch (error.status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 429:
      return ERROR_MESSAGES.RATE_LIMIT;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return error.message || "An unexpected error occurred";
  }
};

// Hook for handling API errors in components
export const useApiErrorHandler = () => {
  const handleError = (error: unknown) => {
    const apiError = handleApiError(error);
    const userMessage = getErrorMessage(apiError);

    // You can integrate with a toast library here
    console.error("API Error:", apiError);

    // For now, just return the message
    // In a real app, you might want to show a toast notification
    return userMessage;
  };

  return { handleError };
};

// Retry utility for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      if (i < maxRetries) {
        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }
  }

  throw lastError;
};

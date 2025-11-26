import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/axios';
import { useAuthStore } from '@/store/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

/**
 * Get auth token from store
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const tokens = useAuthStore.getState().tokens;
  const token = tokens?.accessToken || null;
  // Validate token format (basic check - should be a JWT)
  if (token && token.split('.').length !== 3) {
    console.warn('Invalid token format detected');
    return null;
  }
  return token;
}

/**
 * Get refresh token from store
 */
function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const tokens = useAuthStore.getState().tokens;
  const token = tokens?.refreshToken || null;
  // Validate token format (basic check - should be a JWT)
  if (token && token.split('.').length !== 3) {
    console.warn('Invalid refresh token format detected');
    return null;
  }
  return token;
}

/**
 * Create Axios instance with default configuration
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Request interceptor - Add auth token to requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = getAuthToken();
    if (token) {
      // Ensure Authorization header is set correctly
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors and transform responses
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // If response already has success field, wrap data properly
    if (response.data?.success !== undefined) {
      return {
        ...response,
        data: {
          success: response.data.success,
          data: response.data.data || response.data,
          message: response.data.message,
        },
      };
    }
    
    // Transform response to match ApiResponse format
    return {
      ...response,
      data: {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      },
    };
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token, clear everything and redirect
          if (typeof window !== 'undefined') {
            useAuthStore.getState().logout();
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        // Try to refresh the token - use base axios to avoid interceptors
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Backend returns: { success: true, data: { tokens: { accessToken, refreshToken } } }
        let accessToken: string | undefined;
        let newRefreshToken: string | undefined;

        if (refreshResponse.data?.success && refreshResponse.data.data) {
          const responseData = refreshResponse.data.data;
          // Handle structure: { tokens: { accessToken, refreshToken } }
          if (responseData.tokens) {
            accessToken = responseData.tokens.accessToken;
            newRefreshToken = responseData.tokens.refreshToken;
          }
          // Fallback: direct tokens in data
          else if (responseData.accessToken) {
            accessToken = responseData.accessToken;
            newRefreshToken = responseData.refreshToken;
          }
        }

        if (accessToken) {
          // Store new tokens in store (which also updates localStorage)
          useAuthStore.getState().setTokens({
            accessToken,
            refreshToken: newRefreshToken || refreshToken,
          });
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - user doesn't have permission
    if (error.response?.status === 403) {
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: error.response.data?.error || error.response.data?.message || 'Access forbidden',
        message: error.response.data?.message || 'You do not have permission to access this resource',
      };
      return Promise.reject(errorResponse);
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: error.response.data?.error || error.response.data?.message || 'An error occurred',
        message: error.response.data?.message,
      };
      return Promise.reject(errorResponse);
    } else if (error.request) {
      // Request made but no response received
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: 'Network error occurred',
        message: 'Unable to connect to the server. Please check your internet connection.',
      };
      return Promise.reject(errorResponse);
    } else {
      // Something else happened
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: error.message || 'An error occurred',
      };
      return Promise.reject(errorResponse);
    }
  }
);

/**
 * API methods using Axios
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T, AxiosResponse<ApiResponse<T>>>(url, config).then((res) => res.data),
  
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T, AxiosResponse<ApiResponse<T>>>(url, data, config).then((res) => res.data),
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T, AxiosResponse<ApiResponse<T>>>(url, data, config).then((res) => res.data),
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T, AxiosResponse<ApiResponse<T>>>(url, data, config).then((res) => res.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T, AxiosResponse<ApiResponse<T>>>(url, config).then((res) => res.data),
  
  /**
   * Upload file(s) using FormData
   * @param url - API endpoint
   * @param formData - FormData object containing file(s) and other fields
   * @param onUploadProgress - Optional progress callback
   */
  upload: <T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progress: number) => void
  ) => {
    return axiosInstance
      .post<T, AxiosResponse<ApiResponse<T>>>(
        url,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress && progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onUploadProgress(percentCompleted);
            }
          },
        }
      )
      .then((res) => res.data);
  },
};


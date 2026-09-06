/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
instance.interceptors.request.use(
  async (config) => {
    let token: string | undefined = undefined;

    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("accessToken")?.value;
      } catch (error) {}
    } else {
      const match = document.cookie.match(
        new RegExp("(^| )accessToken=([^;]+)"),
      );
      if (match) token = match[2];
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let refreshToken: string | undefined = undefined;

        if (typeof window === "undefined") {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          refreshToken = cookieStore.get("refreshToken")?.value;
        } else {
          const match = document.cookie.match(
            new RegExp("(^| )refreshToken=([^;]+)"),
          );
          if (match) refreshToken = match[2];
        }

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Make the refresh request directly with standard axios to avoid infinite loops
        const refreshResponse = await axios.post<ApiResponse<ILoginResponse>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken = refreshResponse.data.data?.accessToken;
        const newRefreshToken = refreshResponse.data.data?.refreshToken;

        if (newAccessToken) {
          // Save new tokens
          if (typeof window === "undefined") {
            const { cookies } = await import("next/headers");
            const { setTokenInCookies } = await import("../tokenUtils");
            const cookieStore = await cookies();
            await setTokenInCookies("accessToken", newAccessToken);
            if (newRefreshToken)
              await setTokenInCookies(
                "refreshToken",
                newRefreshToken,
                7 * 24 * 60 * 60,
              );
          } else {
            // Client-side fallback cookie setting (basic)
            document.cookie = `accessToken=${newAccessToken}; path=/; max-age=900; secure; samesite=lax`;
            if (newRefreshToken) {
              document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=604800; secure; samesite=lax`;
            }
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return instance(originalRequest);
        } else {
          throw new Error("No access token in refresh response");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Could also redirect to login here if on client
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data?.message) {
      const serverMessage = error.response.data.message;
      error.message = Array.isArray(serverMessage) ? serverMessage[0] : serverMessage;
    }

    return Promise.reject(error);
  },
);

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <T>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  const response = await instance.get<ApiResponse<T>>(endpoint, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

const httpGetPaginated = async <T>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<PaginatedResponse<T>> => {
  const response = await instance.get<PaginatedResponse<T>>(endpoint, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

const httpPost = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  const response = await instance.post<ApiResponse<T>>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

const httpPut = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  const response = await instance.put<ApiResponse<T>>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

const httpPatch = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  const response = await instance.patch<ApiResponse<T>>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

const httpDelete = async <T>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  const response = await instance.delete<ApiResponse<T>>(endpoint, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

export const httpClient = {
  get: httpGet,
  getPaginated: httpGetPaginated,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};

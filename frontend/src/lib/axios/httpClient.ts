import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}
const axiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(async (config) => {
    let token: string | undefined = undefined;

    if (typeof window === "undefined") {
      // Server-side
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("accessToken")?.value;
      } catch (error) {
        // Ignore dynamic import errors if they occur
      }
    } else {
      // Client-side
      const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
      if (match) token = match[2];
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <T>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<ApiResponse<T>> => {
  try {
    const instance = axiosInstance();
    const response = await instance.get<ApiResponse<T>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`GET request to ${endpoint} failed`, error);
    throw error;
  }
};

const httpGetPaginated = async <T>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<PaginatedResponse<T>> => {
  try {
    const instance = axiosInstance();
    const response = await instance.get<PaginatedResponse<T>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`GET paginated request to ${endpoint} failed`, error);
    throw error;
  }
};

const httpPost = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance().post<ApiResponse<T>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`POST request to ${endpoint} failed`, error);
    throw error;
  }
};

const httpPut = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance().put<ApiResponse<T>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PUT request to ${endpoint} failed`, error);
    throw error;
  }
};

const httpPatch = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance().patch<ApiResponse<T>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PATCH request to ${endpoint} failed`, error);
    throw error;
  }
};

const httpDelete = async <T>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance().delete<ApiResponse<T>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`DELETE request to ${endpoint} failed`, error);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  getPaginated: httpGetPaginated,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};

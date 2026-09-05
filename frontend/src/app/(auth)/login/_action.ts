/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { LoginFormData, loginValidationSchema } from "@/zod/auth.validation";
import { AxiosError } from "axios";
import { setTokenInCookies } from "@/lib/tokenUtils";

export const loginAction = async (
  payload: LoginFormData,
): Promise<ApiResponse<ILoginResponse> | ApiErrorResponse> => {
  const parsedPayload = loginValidationSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
      statusCode: 400,
    };
  }

  try {
    // httpClient.post already returns ApiResponse<T>
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    // Save token to cookies using the custom tokenUtils so it auto-calculates maxAge!
    if (response.success && response.data?.token) {
      await setTokenInCookies("accessToken", response.data.token);
    }

    return response;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.data) {
      const backendError = error.response.data as any;
      return {
        success: false,
        message: backendError.message || "Invalid credentials",
        statusCode: backendError.statusCode || error.response.status || 401,
      };
    }

    return {
      success: false,
      message: `Login failed: ${error.message}`,
      statusCode: 500,
    };
  }
};

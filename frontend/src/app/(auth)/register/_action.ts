"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, ApiErrorResponse } from "@/types/api.types";
import { IRegisterResponse, ILoginResponse } from "@/types/auth.types";
import { RegisterFormData, registerValidationSchema } from "@/zod/auth.validation";
import { AxiosError } from "axios";
import { setTokenInCookies } from "@/lib/tokenUtils";

export const registerAction = async (
  payload: RegisterFormData,
): Promise<ApiResponse<IRegisterResponse> | ApiErrorResponse> => {
  const parsedPayload = registerValidationSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
      statusCode: 400,
    };
  }

  try {
    // 1. Register the user
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      parsedPayload.data,
    );

    // 2. Automatically log them in to get the token!
    if (response.success) {
      try {
        const loginResponse = await httpClient.post<ILoginResponse>("/auth/login", {
          email: parsedPayload.data.email,
          password: parsedPayload.data.password,
        });

        // 3. Save the token to cookies using custom tokenUtils
        if (loginResponse.success && loginResponse.data?.token) {
          await setTokenInCookies("accessToken", loginResponse.data.token);
        }
      } catch (loginError) {
        console.error("Auto-login failed after registration:", loginError);
        // We won't throw here, because registration technically succeeded.
      }
    }

    return response;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.data) {
      const backendError = error.response.data as any;
      
      // Handle NestJS class-validator array messages gracefully
      let errorMessage = backendError.message || "Registration failed";
      if (Array.isArray(backendError.message)) {
        errorMessage = backendError.message[0];
      }

      return {
        success: false,
        message: errorMessage,
        statusCode: backendError.statusCode || error.response?.status || 400,
      };
    }

    return {
      success: false,
      message: `Registration failed: ${error.message}`,
      statusCode: 500,
    };
  }
};

"use server";

import z from "zod";
import {
  forgotPasswordFormSchema,
  registerFormSchema,
  resetPasswordFormSchema,
  verifyEmailFormSchema,
} from "@/lib/schemas/auth.schema";
import api from "@/lib/axios";
import { AuthPages, CookieKeys, HttpStatusCode, Routes } from "@/lib/constants";
import { ActionResponseType, UserType } from "@/types";
import { cookies } from "next/headers";

export const registerAction = async (
  data: z.infer<typeof registerFormSchema>
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/auth/register`, data);

    if (response.status !== 201) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
      redirectTo: `/${Routes.AUTH}/${AuthPages.VERIFY_EMAIL}/${response.data.user._id}`,
    };
  } catch (error) {
    console.log("Register Action Error:");
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const verifyEmailAction = async (
  data: z.infer<typeof verifyEmailFormSchema>,
  userId: string
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/auth/verify-email/${userId}`, data);

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
      redirectTo: `/${Routes.AUTH}/${AuthPages.LOGIN}`,
    };
  } catch (error) {
    console.log("Verify Email Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const resendEmailVerificationAction = async (
  userId: string
): Promise<ActionResponseType> => {
  try {
    const response = await api.get(`/auth/resend-otp/${userId}`);

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.log("Resend Email Verification Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const forgotPasswordAction = async (
  data: z.infer<typeof forgotPasswordFormSchema>
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/auth/forgot-password`, data);

    if (response.status !== HttpStatusCode.OK) {
      if (
        response.status === HttpStatusCode.FORBIDDEN &&
        response.data.userId
      ) {
        return {
          success: false,
          message: response.data.message,
          redirectTo: `/${Routes.AUTH}/${AuthPages.VERIFY_EMAIL}/${response.data.userId}`,
        };
      }
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.log("Forgot Password Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Something sent wrong. Please try again.",
    };
  }
};

export const resetPasswordAction = async (
  data: z.infer<typeof resetPasswordFormSchema>,
  token: string
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      newPassword: data.password,
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
      redirectTo: `/${Routes.AUTH}/${AuthPages.LOGIN}`,
    };
  } catch (error) {
    console.log("Reset Password Action Error:");
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const verifyResetPasswordTokenAction = async (
  token: string
): Promise<{
  isVerified: boolean;
  isExpired: boolean;
}> => {
  try {
    const response = await api.get(
      `/auth/verify-reset-password-token/${token}`
    );

    return {
      isVerified: response.data.isVerified,
      isExpired: response.data.isExpired,
    };
  } catch (error) {
    console.log("Verify Reset Password Token Action:");
    console.log(error);
    return {
      isVerified: false,
      isExpired: false,
    };
  }
};

export const getProfileDataAction = async (): Promise<UserType | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CookieKeys.ACCESSTOKEN)?.value;

    if (!token) {
      return null;
    }

    const response = await api.get(`/auth/profile-data`);

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    return response.data.user;
  } catch (error) {
    console.log("Get Profile Data Action Error :");
    console.log(error);
    return null;
  }
};

export const isLoggedinAction = async (): Promise<boolean> => {
  try {
    const response = await api.get(`/auth/verify-token`);

    if(response.status !== 200) {
      return false;
    }

    return response.data.isAuthenticated;
  } catch (error) {
    console.log("Is Loggedin Action Error :");
    console.log(error);
    return false;
  }
};

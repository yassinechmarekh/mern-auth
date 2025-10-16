"use server";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { CookieKeys, HttpStatusCode } from "./constants";
import { cookies } from "next/headers";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Automatically adds the token
api.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(CookieKeys.ACCESSTOKEN)?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ➤ Variables to avoid multiple refreshes
let isRefreshing = false; // This variable prevents multiple simultaneous calls to refresh-token.
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = []; // This is a queue of all requests that failed while refresh-token was in progress.

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  async (
    response: AxiosResponse & {
      config?: AxiosRequestConfig & { _retry?: boolean };
    }
  ) => {
    const originalRequest = response.config; // We recover the original request that failed
    console.log("start refresh interceptor");
    if (
      response.status === HttpStatusCode.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get(CookieKeys.REFRESHTOKEN)?.value;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
            validateStatus: () => true,
          }
        );

        const newAccessToken = response.data.accessToken;

        if (newAccessToken) {
          // set newAccesToken
          cookieStore.set(CookieKeys.ACCESSTOKEN, newAccessToken, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
          });

          // launch all pending requests with the new token
          processQueue(null, newAccessToken);

          // replace authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // run original request
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  }
);

export default api;

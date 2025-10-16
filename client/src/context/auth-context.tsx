"use client";

import { UserType } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { getProfileDataAction } from "@/actions/auth.action";
import axios from "axios";
import { CookieKeys, HttpStatusCode, Routes } from "@/lib/constants";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  fetchUser: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setUser(await getProfileDataAction());
    } catch (error) {
      console.log("Fetch User Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          validateStatus: () => true,
          withCredentials: true,
        }
      );

      if (response.status !== HttpStatusCode.OK) {
        toast.error("Logout error", {
          description: "Internal server error.",
        });
        return;
      }

      setIsLoading(true);
      setUser(null);
      setIsLoading(false);
      Cookies.remove(CookieKeys.ACCESSTOKEN);
      router.push(`${Routes.ROOT}`);
    } catch (error) {
      console.log("Logout Error :", error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    fetchUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

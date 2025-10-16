"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import Link from "next/link";
import { toast } from "sonner";
import z from "zod";
import { loginFormSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthPages, CookieKeys, HttpStatusCode, Routes } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import GoogleAuthBtn from "../google-auth-btn";

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const { fetchUser } = useAuth();

  const loginHandler = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      setIsLoading(true);
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data,
        {
          validateStatus: () => true,
          withCredentials: true,
        }
      );

      if (result.status !== HttpStatusCode.OK) {
        toast.error(result.data.message);
        return;
      }

      const accessToken = result.data.accessToken;
      if (!accessToken) {
        toast.error("Token not received from server.");
        return;
      }
      Cookies.set(CookieKeys.ACCESSTOKEN, accessToken, {
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });

      await fetchUser();

      router.replace(`/${Routes.DASHBOARD}`);
    } catch (error) {
      console.log("Login Hanlder Error:");
      console.log(error);
      toast.error("Internal server error", {
        description: "Something went wrong. Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(loginHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href={`/${Routes.AUTH}/${AuthPages.FORGOT_PASSWORD}`}
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  id="password"
                  placeholder="********"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full disabled:pointer-events-none"
            disabled={
              isLoading || Object.keys(form.formState.errors).length > 0
            }
          >
            {isLoading ? "Loading ..." : "Login"}
          </Button>
          <GoogleAuthBtn />
        </div>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href={`/${Routes.AUTH}/${AuthPages.REGISTER}`}
            className="underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;

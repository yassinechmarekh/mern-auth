"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Link from "next/link";
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";
import { registerFormSchema } from "@/lib/schemas/auth.schema";
import { registerAction } from "@/actions/auth.action";
import { useRouter } from "next/navigation";
import { ActionResponseType } from "@/types";

const RegisterForm = () => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const registerHandler = async (data: z.infer<typeof registerFormSchema>) => {
    try {
      setIsLoading(true);

      const result: ActionResponseType = await registerAction(data);

      if (result.success) {
        toast.success(result.message);
        if (result.redirectTo) {
          router.replace(result.redirectTo);
        }
      } else {
        toast.error(result.message);
      }
      console.log(data);
    } catch (error) {
      console.log("Register Hanlder Error:");
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
      <form onSubmit={form.handleSubmit(registerHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username">Username</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  type="text"
                  placeholder="Jean"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="text"
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
              <FormLabel htmlFor="password">Password</FormLabel>
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

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  id="confirm_password"
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
            {isLoading ? "Loading ..." : "Register"}
          </Button>
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          You already have an account?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;

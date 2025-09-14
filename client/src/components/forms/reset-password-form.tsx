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
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { resetPasswordFormSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPasswordForm = () => {
  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetPasswordHandler = (
    data: z.infer<typeof resetPasswordFormSchema>
  ) => {
    try {
      setIsLoading(true);
      console.log(data);
    } catch (error) {
      console.log("Reset Password Handler Error:");
      console.log(error);
      toast.error("Internal server error.", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(resetPasswordHandler)}
        className="space-y-8"
      >
        <div className="grid gap-4">
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="password">New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="confirm_password">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    id="confirm_password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full disabled:pointer-events-none"
            disabled={
              isLoading || Object.keys(form.formState.errors).length > 0
            }
          >
            {isLoading ? "Loading ..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;

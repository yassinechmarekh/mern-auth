"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import z from "zod";
import { forgotPasswordFormSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordHandler = (data: z.infer<typeof forgotPasswordFormSchema>) => {
    try {
      console.log(data);
    } catch (error) {
      console.log("Forgot Password Handler:");
      console.log(error);
      toast.error("Internal server error", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(forgotPasswordHandler)}
        className="space-y-8"
      >
        <div className="grid gap-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="johndoe@mail.com"
                    type="text"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;

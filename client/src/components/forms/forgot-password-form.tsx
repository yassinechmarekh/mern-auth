"use client";

import React, { useState } from "react";
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
import { forgotPasswordAction } from "@/actions/auth.action";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const forgotPasswordHandler = async (
    data: z.infer<typeof forgotPasswordFormSchema>
  ) => {
    try {
      setIsLoading(true);
      const result = await forgotPasswordAction(data);

      if (!result.success) {
        if (result.redirectTo) {
          router.push(result.redirectTo);
          toast.warning(result.message);
          return;
        } else {
          toast.error(result.message);
          return;
        }
      }

      toast.success(result.message);
    } catch (error) {
      console.log("Forgot Password Handler:");
      console.log(error);
      toast.error("Internal server error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading || Object.keys(form.formState.errors).length > 0
            }
          >
            {isLoading ? "Loading..." : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;

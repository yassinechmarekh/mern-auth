"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { verifyEmailFormSchema } from "@/lib/schemas/auth.schema";
import { Button } from "../ui/button";
import { verifyEmailAction } from "@/actions/auth.action";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Terminal } from "lucide-react";

interface VerifyEmailFormProps {
  userId: string;
}

const VerifyEmailForm = ({ userId }: VerifyEmailFormProps) => {
  const form = useForm<z.infer<typeof verifyEmailFormSchema>>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      codeOTP: 0,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const clearError = () => {
    setError(null);
  };

  const verifyEmailHandler = async (
    data: z.infer<typeof verifyEmailFormSchema>
  ) => {
    try {
      setIsLoading(true);
      const result = await verifyEmailAction(data, userId);

      if (!result.success) {
        setError(result.message);
        return;
      } else {
        clearError();
        if (result.redirectTo) {
          router.replace(result.redirectTo);
        }
        toast.success(result.message);
      }
    } catch (error) {
      console.log("Verify Email Hanlder Error:");
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
      <form
        onSubmit={form.handleSubmit(verifyEmailHandler)}
        className="space-y-4"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full">
            <div className="flex items-center">
              <AlertCircle className="size-4 text-red-600 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="codeOTP"
          render={({ field }) => (
            <FormItem className={"flex flex-col items-center"}>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern="^\d+$"
                  inputMode="numeric"
                  {...field}
                  value={field.value === 0 ? "" : field.value.toString()}
                  onChange={(value: string) => {
                    field.onChange(Number(value));
                  }}
                >
                  <InputOTPGroup className={"space-x-3"}>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Enter the 6-digit code sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full disabled:pointer-events-none"
          disabled={isLoading || Object.keys(form.formState.errors).length > 0}
        >
          {isLoading ? "Loading ..." : "Verify Email"}
        </Button>
      </form>
    </Form>
  );
};

export default VerifyEmailForm;

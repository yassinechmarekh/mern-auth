import Container from "@/components/container";
import VerifyEmailForm from "@/components/forms/verify-email-form";
import ResendEmailVerification from "@/components/resend-email-verification";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const VerifyEmailRoute = () => {
  return (
    <div className={"flex items-center justify-center min-h-screen"}>
      <Container>
        <Card className={"max-w-md mx-auto"}>
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium text-slate-800">your email</span>.
              Enter the code below to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className={"space-y-4"}>
            {/* Verify Email Form */}
            <VerifyEmailForm />

            {/* Resend Email Verification */}
            <ResendEmailVerification />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default VerifyEmailRoute;

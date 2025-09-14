import React from "react";
import Container from "@/components/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/forms/reset-password-form";

const ResetPasswordRoute = () => {
  return (
    <div className={"flex items-center justify-center min-h-screen"}>
      <Container>
        <Card className={"max-w-md mx-auto"}>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
            Enter your new password to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Reset Password Form */}
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ResetPasswordRoute;

import React from "react";
import Container from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "@/components/forms/reset-password-form";
import { verifyResetPasswordTokenAction } from "@/actions/auth.action";

interface ResetPasswordRouteProps {
  token: string;
}

const ResetPasswordRoute = async ({ token }: ResetPasswordRouteProps) => {
  const isVerified: boolean = (await verifyResetPasswordTokenAction(token))
    .isVerified;
  const isExpired: boolean = (await verifyResetPasswordTokenAction(token))
    .isExpired;
  console.log("Token Verified :", isVerified);
  console.log("Token Expired :", isExpired);
  return (
    <div className={"flex items-center justify-center min-h-screen"}>
      <Container>
        {isVerified ? (
          isExpired ? (
            <p className={'text-center'}>Expired Link</p>
          ) : (
            <Card className={"max-w-md mx-auto"}>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  Enter your new password to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Reset Password Form */}
                <ResetPasswordForm token={token} />
              </CardContent>
            </Card>
          )
        ) : (
          <p className={'text-center'}>Invalid Link</p>
        )}
      </Container>
    </div>
  );
};

export default ResetPasswordRoute;

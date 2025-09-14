import React from 'react'
import Container from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordForm from '@/components/forms/forgot-password-form';

const ForgotPasswordRoute = () => {
  return (
    <div className={"flex items-center justify-center min-h-screen"}>
      <Container>
        <Card className={"max-w-md mx-auto"}>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className={"space-y-4"}>
            {/* Forgot Password Form */}
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}

export default ForgotPasswordRoute
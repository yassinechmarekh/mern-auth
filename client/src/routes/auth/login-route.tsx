import React from "react";
import Container from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/forms/login-form";

const LoginRoute = () => {
  return (
    <div className={"flex items-center justify-center min-h-screen"}>
      <Container>
        <Card className={"max-w-md mx-auto"}>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Login Form */}
            <LoginForm />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default LoginRoute;

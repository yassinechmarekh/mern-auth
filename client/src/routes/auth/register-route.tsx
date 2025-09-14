import React from "react";
import Container from "@/components/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/components/forms/register-form";

const RegisterRoute = () => {
  return (
    <div className={"flex items-center justify-center min-h-screen"}>
      <Container>
        <Card className={"max-w-md mx-auto"}>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your username, email and password to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Register Form */}
            <RegisterForm />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default RegisterRoute;

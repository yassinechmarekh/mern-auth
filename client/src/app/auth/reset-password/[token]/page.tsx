import React from "react";
import ResetPasswordRoute from "@/routes/auth/reset-password-route";

interface ResetPasswordPageProps {
  params: Promise<{token: string}>;
}

const ResetPasswordPage = async ({params}: ResetPasswordPageProps) => {
  const token = (await params).token;
  return <ResetPasswordRoute token={token} />;
};

export default ResetPasswordPage;

import React from "react";
import VerifyEmailRoute from "@/routes/auth/verify-email-route";

interface VerifyEmailPageProps {
  params: Promise<{ userId: string }>;
}

const VerifyEmailPage = async ({ params }: VerifyEmailPageProps) => {
  const userId = (await params).userId;
  return <VerifyEmailRoute userId={userId} />;
};

export default VerifyEmailPage;

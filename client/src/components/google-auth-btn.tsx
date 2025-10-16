"use client";

import React from "react";
import { Button } from "./ui/button";

const GoogleAuthBtn = () => {
  const handleGoogleAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      type="button"
      onClick={handleGoogleAuth}
    >
      Login with Google
    </Button>
  );
};

export default GoogleAuthBtn;

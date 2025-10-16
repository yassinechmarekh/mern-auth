"use client";

import React, { useEffect } from "react";
import Container from "@/components/container";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { AuthPages, CookieKeys, Routes } from "@/lib/constants";

const SuccessRoute = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();

  useEffect(() => {
    if (token) {
      Cookies.set(CookieKeys.ACCESSTOKEN, token, {
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });
      router.replace(`/${Routes.DASHBOARD}`);
    } else {
      router.replace(`/${Routes.AUTH}/${AuthPages.LOGIN}`);
    }
  }, [token, router]);
  return (
    <Container className={"flex items-center justify-center min-h-screen"}>
      <span>Authentication Loading ...</span>
    </Container>
  );
};

export default SuccessRoute;

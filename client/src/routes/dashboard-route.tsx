"use client";

import React from "react";
import Container from "@/components/container";
import Header from "@/components/header";
import { useAuth } from "@/context/auth-context";

const DashboardRoute = () => {
  const { user, isLoading } = useAuth();
  return (
    <Container className={"flex flex-col min-h-screen"}>
      <Header />
      <div className={"flex-1 flex items-center justify-center"}>
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          user && (
            <h1>
              Welcome <span className={"font-bold"}>{user.username}</span> to
              your account.
            </h1>
          )
        )}
      </div>
    </Container>
  );
};

export default DashboardRoute;

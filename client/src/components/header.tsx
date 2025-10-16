"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

const Header = () => {
  const { user, isLoading, logout } = useAuth();
  return (
    <div className={"flex items-center justify-between py-2"}>
      <h1 className={"font-bold"}>Logo</h1>
      <div className={"flex items-center gap-x-1"}>
        {isLoading ? (
          <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
        ) : user ? (
          <>
            <span className="text-sm mr-2">Welcome, {user.username.toUpperCase()}</span>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button asChild>
              <Link href={"/auth/login"}>Login</Link>
            </Button>
            <Button asChild>
              <Link href={"/auth/register"}>Register</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

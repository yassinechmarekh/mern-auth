import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <div className={"flex items-center justify-between py-2"}>
      <h1 className={'font-bold'}>Logo</h1>
      <div className={"flex items-center gap-x-1"}>
        <Button asChild>
          <Link href={"/auth/login"}>Login</Link>
        </Button>
        <Button asChild>
          <Link href={"/auth/register"}>Register</Link>
        </Button>
      </div>
    </div>
  );
};

export default Header;

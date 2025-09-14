"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const TIMER_DURATION = 120;
const STORAGE_KEY = "otp_timer_start";

const ResendEmailVerification = () => {
  const [intervalTime, setIntervalTime] = useState<number>(0);

  const getRemainingTimeFromStorage = () => {
    const savedTime = localStorage.getItem(STORAGE_KEY);
    if (savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      const remaining = TIMER_DURATION - elapsed;
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  };

  useEffect(() => {
    setIntervalTime(getRemainingTimeFromStorage());
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (intervalTime > 0) {
      timer = setInterval(() => {
        setIntervalTime((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(STORAGE_KEY);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [intervalTime]);

  const handleResendOTP = async () => {
    try {
      console.log("We sent a new OTP.");
    } catch (error) {
      console.log(error);
      toast.error("Internal server error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY, now.toString());
      setIntervalTime(getRemainingTimeFromStorage());
    }
  };

  return intervalTime > 0 ? (
    <p className="text-center text-sm">
      You can resend the code in <strong>{intervalTime}</strong> seconds.
    </p>
  ) : (
    <p className="text-center text-sm">
      Didn't receive the code?{" "}
      <Button
        variant={"link"}
        className="font-medium px-0 cursor-pointer"
        onClick={handleResendOTP}
      >
        Resend Code
      </Button>
    </p>
  );
};

export default ResendEmailVerification;

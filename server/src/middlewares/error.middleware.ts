import { NextFunction, Request, Response } from "express";
import { Environment } from "../utils/constant";

interface AppError extends Error {
    status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  console.log("Error Hanlder :");
  console.log(err.stack);
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === Environment.DEVELOPMENT ? err.stack : null,
  });
};

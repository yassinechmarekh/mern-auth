import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { HttpStatusCode } from "../utils/constant";
import mongoose from "mongoose";

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "All fields are required.",
      });
      return;
    }

    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: validation.error.issues[0].message,
      });
      return;
    }

    req.body = validation.data;

    next();
  };

export const validateObjectId =
  (paramName: string) => (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!id) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: `Parameter '${paramName}' is required.`,
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: `Parameter '${paramName}' is not valid ObjectId.`,
      });
      return;
    }

    next();
  };

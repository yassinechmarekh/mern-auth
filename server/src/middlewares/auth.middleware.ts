import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../utils/constant";
import { TokenPayloadType } from "../types";
import jwt from "jsonwebtoken";
import { getUserByIdService } from "../services/user.service";
import { IUser } from "../models/User.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "No acess token provided.",
    });
    return;
  }

  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!accessToken) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid token format.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY as string
    ) as TokenPayloadType;

    if (!decoded.userId) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: "Invalid token payload." });
      return;
    }

    req.user = await getUserByIdService(decoded.userId);
    next();
  } catch (error) {
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Invalid or expired access token." });
    return;
  }
};

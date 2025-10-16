import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import type { StringValue } from "ms";

export const generateAccessToken = (userId: Types.ObjectId) => {
  const token = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET_KEY as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES as StringValue,
    }
  );
  return token;
};

export const generateRefreshToken = (userId: Types.ObjectId) => {
  const token = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET_KEY as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES as StringValue,
    }
  );

  return token;
};

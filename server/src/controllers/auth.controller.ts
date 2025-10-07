import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User.model";
import { HttpStatusCode } from "../utils/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmailVerification, sendResetPasswordEmail } from "../utils/mail";
import { Types } from "mongoose";
import {
  getUserByIdService,
  updateUserService,
} from "../services/user.service";

/**----------------------------------------
 * @desc Register new user
 * @route /api/auth/register
 * @method POST
 * @access public  
 -----------------------------------------*/
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    let user: IUser | null;
    user = await User.findOne({ email });

    if (user) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message:
          "Your email is already exist in our data base. Please login to your account.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // send otp code to verify email
    await sendEmailVerification(user._id as Types.ObjectId);

    res.status(201).json({
      message: "We send a verification email. Please check your inbox.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Register Controller Error:");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Verify email
 * @route /api/auth/verify-email/:userId
 * @method POST
 * @access public  
 -----------------------------------------*/
export const verifyEmailControler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const { codeOTP } = req.body;

    const user = await getUserByIdService(new Types.ObjectId(userId));

    if (!user.otpCode || !user.otpExpiredAt) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Please request for OTP code first.",
      });
      return;
    }

    const isMatch = await bcrypt.compare(codeOTP.toString(), user.otpCode);
    const isExpired = Date.now() > new Date(user.otpExpiredAt).getTime();

    if (!isMatch || isExpired) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid or expired OTP code.",
      });
      return;
    }

    await updateUserService(user._id as Types.ObjectId, {
      otpCode: undefined,
      otpExpiredAt: undefined,
      isVerified: true,
    });

    res.status(HttpStatusCode.OK).json({
      message: "Your account is verified successfully. Please login.",
    });
  } catch (error) {
    console.log("Verify Email Controller Error :");
    next(error);
  }
};

/**----------------------------------------
 * @desc Resend email verification
 * @route /api/auth/resend-otp/:userId
 * @method GET
 * @access public  
 -----------------------------------------*/
export const resendEmailVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await getUserByIdService(new Types.ObjectId(userId));

    await sendEmailVerification(user._id as Types.ObjectId);

    res
      .status(HttpStatusCode.OK)
      .json({ message: "We send a new OTP. Please verify your email." });
  } catch (error) {
    console.log("Resend Email Verification Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Forgot password
 * @route /api/auth/forgot-password
 * @method POST
 * @access public  
 -----------------------------------------*/
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "You have not an account in our platform.",
      });
      return;
    }

    if (!user.isVerified) {
      await sendEmailVerification(user._id as Types.ObjectId);

      res.status(HttpStatusCode.FORBIDDEN).json({
        message:
          "You must first verify your email. We send a verification email, check your inbox.",
        userId: user._id,
      });
      return;
    }

    await sendResetPasswordEmail(user._id as Types.ObjectId);

    res.status(HttpStatusCode.OK).json({
      message:
        "We sent a email to reset your password. Please check your inbox.",
    });
  } catch (error) {
    console.log("Forgot Password Controller Error:");
    console.log(error);
    next(error);
  }
};

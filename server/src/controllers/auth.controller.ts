import { NextFunction, Request, Response, response } from "express";
import User, { IUser } from "../models/User.model";
import {
  AuthProviders,
  CookieKeys,
  Environment,
  HttpStatusCode,
} from "../utils/constant";
import bcrypt from "bcrypt";
import { sendEmailVerification, sendResetPasswordEmail } from "../utils/mail";
import { Types } from "mongoose";
import {
  getUserByIdService,
  updateUserService,
} from "../services/user.service";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";
import { TokenPayloadType } from "../types";

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
      providers: [AuthProviders.LOCAL],
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

/**----------------------------------------
 * @desc Reset Password
 * @route /api/auth/reset-password/:token
 * @method POST
 * @access public  
 -----------------------------------------*/
export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;

    if (!token) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "No token provided.",
      });
      return;
    }

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user || !user.resetPasswordTokenExpiredAt) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Invalid token.",
      });
      return;
    }

    const isExpired: boolean =
      new Date(Date.now()) > new Date(user.resetPasswordTokenExpiredAt);

    if (isExpired) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Your token is expired. Request a new link.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updateUserService(user._id as Types.ObjectId, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiredAt: null,
    });

    res.status(HttpStatusCode.OK).json({
      message: "Your password is updated successfully. Please login.",
    });
  } catch (error) {
    console.log("Reset Password Controller Error:");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Verify Reset Password Token
 * @route /api/auth/verify-reset-password-token/:token
 * @method GET
 * @access public  
 -----------------------------------------*/
export const verifyResetPasswordTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        isVerified: false,
        isExpired: false,
        message: "No token provided.",
      });
      return;
    }

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user || !user.resetPasswordTokenExpiredAt) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        isVerified: false,
        isExpired: false,
        message: "Invalid token.",
      });
      return;
    }

    const isExpired: boolean =
      new Date(Date.now()) > new Date(user.resetPasswordTokenExpiredAt);

    if (isExpired) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        isVerified: true,
        isExpired: true,
        message: "Token expired.",
      });
      return;
    }

    res.status(HttpStatusCode.OK).json({
      isVerified: true,
      isExpired: false,
      message: "Token verified.",
    });
  } catch (error) {
    console.log("Verify Reset Password Token Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Login
 * @route /api/auth/login
 * @method POST
 * @access public  
 -----------------------------------------*/
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: "Invalid email or password" });
      return;
    }

    if (!user.isVerified) {
      await sendEmailVerification(user._id as Types.ObjectId);
      res.status(HttpStatusCode.FORBIDDEN).json({
        message:
          "You need to verify your account. We send an email verification, please check your inbox.",
      });
      return;
    }

    const passwordsMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordsMatch) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
      return;
    }

    const accessToken = generateAccessToken(user._id as Types.ObjectId);
    const refreshToken = generateRefreshToken(user._id as Types.ObjectId);

    res
      .cookie(CookieKeys.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(HttpStatusCode.OK)
      .json({
        accessToken,
      });
  } catch (error) {
    console.log("Login Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Get profile data logeddin
 * @route /api/auth/profile-data
 * @method GET
 * @access private  
 -----------------------------------------*/
export const getProfileDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Not authenticated.",
      });
      return;
    }

    res.status(HttpStatusCode.OK).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage?.url,
      },
    });
  } catch (error) {
    console.log("Get Profile Data Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Logout
 * @route /api/auth/logout
 * @method GET
 * @access private  
 -----------------------------------------*/
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;

    if (!cookies[CookieKeys.REFRESH_TOKEN]) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "No token provided.",
      });
      return;
    }

    res
      .clearCookie(CookieKeys.REFRESH_TOKEN, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(HttpStatusCode.OK)
      .json({
        message: "Your are logout.",
      });
  } catch (error) {
    console.log("Logout Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Refresh Token
 * @route /api/auth/refresh
 * @method GET
 * @access public  
 -----------------------------------------*/
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies[CookieKeys.REFRESH_TOKEN];

    if (!refreshToken) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Missing refresh token. Please login.",
      });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY as string
    ) as TokenPayloadType;

    if (!decoded || !decoded.userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Invalid refresh token.",
      });
      return;
    }

    const user = await getUserByIdService(decoded.userId);

    const newAccessToken = generateAccessToken(user._id as Types.ObjectId);

    res.status(HttpStatusCode.OK).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log("Refresh Token Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Verify Access Token (is authenticated ?)
 * @route /api/auth/verify-token
 * @method GET
 * @access public  
 -----------------------------------------*/
export const verifyAccessTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        isAuthenticated: false,
      });
      return;
    }

    const accessToken = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!accessToken) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        isAuthenticated: false,
      });
      return;
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      (err, decoded) => {
        if (err || !decoded) {
          res.status(HttpStatusCode.UNAUTHORIZED).json({
            isAuthenticated: false,
          });
          return;
        }

        res.status(HttpStatusCode.OK).json({
          isAuthenticated: true,
        });
        return;
      }
    );
  } catch (error) {
    console.log("Verify Access Token Controller Error :");
    console.log(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      isAuthenticated: false,
    });
  }
};

/**----------------------------------------
 * @desc Google callback
 * @route /api/auth/google/callback
 * @method GET
 * @access public  
 -----------------------------------------*/
export const googleCallbackController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = req.user;

    if (!user) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "No user from Google strategy",
      });
      return;
    }

    const accessToken = generateAccessToken(user._id as Types.ObjectId);
    const refreshToken = generateRefreshToken(user._id as Types.ObjectId);

    res
      .cookie(CookieKeys.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .redirect(
        `${process.env.CLIENT_DOMAIN}/auth/success?token=${accessToken}`
      );
  } catch (error) {
    console.log("Google Callback Controller Error :");
    console.log(error);
    next(error);
  }
};

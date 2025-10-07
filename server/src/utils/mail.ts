import { Types } from "mongoose";
import nodemailer from "nodemailer";
import {
  getUserByIdService,
  updateUserService,
} from "../services/user.service";
import { randomBytes, randomInt } from "crypto";
import bcrypt from "bcrypt";
import { IUser } from "../models/User.model";
import ejs from "ejs";
import path from "path";

interface SendEmailProps {
  to: string;
  subject: string;
  template: string;
}

export const sendEmail = async ({
  to,
  subject,
  template,
}: SendEmailProps): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODE_MAILER_HOST as string,
    port: parseInt(process.env.NODE_MAILER_PORT as string),
    secure: false,
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.APP_EMAIL as string,
    to,
    subject,
    html: template,
  });

  return !!info.messageId;
};

export const sendEmailVerification = async (
  userId: Types.ObjectId
): Promise<boolean> => {
  const user: IUser = await getUserByIdService(userId);

  const codeOtp = randomInt(100000, 999999);

  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(codeOtp.toString(), salt);

  await updateUserService(user._id as Types.ObjectId, {
    otpCode: hashedOTP,
    otpExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const templatePath = path.join(
    __dirname,
    "../views/emails/verification-email.ejs"
  );

  const template = await ejs.renderFile(templatePath, {
    username: user.username,
    codeOtp,
  });

  const mailOptions = {
    to: user.email,
    subject: "Verify Your Email - OTP Code",
    template,
  };

  const isSend = await sendEmail(mailOptions);

  if (!isSend) {
    throw new Error(
      "An error was expected while sending a verification email."
    );
  }

  return isSend;
};

export const sendResetPasswordEmail = async (
  userId: Types.ObjectId
): Promise<boolean> => {
  const user = await getUserByIdService(userId);

  const resetPasswordToken = randomBytes(30).toString("hex");
  const link = `${process.env.CLIENT_DOMAIN}/auth/reset-password/${resetPasswordToken}`;

  await updateUserService(user._id as Types.ObjectId, {
    resetPasswordToken,
    resetPasswordTokenExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const templatePath = path.join(
    __dirname,
    "../views/emails/reset-password-email.ejs"
  );

  const template = await ejs.renderFile(templatePath, {
    username: user.username,
    link,
  });

  const mailOptions = {
    to: user.email,
    subject: "Reset Password Email",
    template,
  };

  const isSend = await sendEmail(mailOptions);

  if (!isSend) {
    throw new Error(
      "An error was expected while sending a verification email."
    );
  }

  return isSend;
};

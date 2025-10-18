import mongoose, { Document, Schema } from "mongoose";
import { AuthProviders } from "../utils/constant";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  providers: (AuthProviders.LOCAL | AuthProviders.GOOGLE)[];
  googleId: string;
  profileImage?: {
    url: string;
    publicId: string;
  };
  otpCode?: string;
  otpExpiredAt?: Date;
  isVerified: boolean;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiredAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.providers.includes(AuthProviders.LOCAL);
      },
    },
    providers: {
      type: [String],
      enum: [AuthProviders.LOCAL, AuthProviders.GOOGLE],
    },
    googleId: {
      type: String,
      sparse: true,
      required: function (this: IUser) {
        return this.providers.includes(AuthProviders.GOOGLE);
      },
    },
    profileImage: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    otpCode: {
      type: String,
    },
    otpExpiredAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;

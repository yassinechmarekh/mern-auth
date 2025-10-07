import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage?: {
    url: string;
    publicId: string;
  };
  otpCode?: string;
  otpExpiredAt?: Date;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiredAt?: Date;
  createdAt: Date;
  updateAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
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
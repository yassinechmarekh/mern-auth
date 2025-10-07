import { Types } from "mongoose";
import User, { IUser } from "../models/User.model";

export const getUserByIdService = async (
  userId: Types.ObjectId
): Promise<IUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

export const updateUserService = async (
  userId: Types.ObjectId,
  updatedData: Partial<IUser>
): Promise<IUser> => {
  const user = await getUserByIdService(userId);

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });

  if (!updatedUser) {
    throw new Error(`Unable to edit ${user.username}'s information`);
  }

  return updatedUser;
};

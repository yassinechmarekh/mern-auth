export type ActionResponseType = {
  success: boolean;
  message: string;
  redirectTo?: string;
};

export type UserType = {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
};

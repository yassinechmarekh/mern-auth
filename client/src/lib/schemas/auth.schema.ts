import z from "zod";

export const loginFormSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty().min(6),
});

export const registerFormSchema = z
  .object({
    username: z.string().nonempty().min(2),
    email: z.string().nonempty().email(),
    password: z.string().min(8),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    error: "The passwords does not match.",
  });

export const verifyEmailFormSchema = z.object({
  codeOTP: z.number().min(100000).max(999999),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().nonempty().email(),
});

export const resetPasswordFormSchema = z
  .object({
    password: z.string().nonempty().min(8),
    confirm_password: z.string().nonempty(),
  })
  .refine((val) => val.password === val.confirm_password, {
    path: ["confirm_password"],
    error: "The passwords does not match.",
  });

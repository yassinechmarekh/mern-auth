import z from "zod";

export const registerSchema = z
  .object({
    username: z.string().nonempty().min(2),
    email: z.string().nonempty().email(),
    password: z.string().nonempty().min(8),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    error: "The passwords does not match.",
  });

export const verifyEmailSchema = z.object({
  codeOTP: z.number().min(100000).max(999999),
});

import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(120),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Enter a valid 10-digit SA mobile number")
    .optional(),
  idNumber: z
    .string()
    .regex(/^\d{13}$/, "Enter a valid 13-digit SA ID number")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const verifyTwoFactorSchema = z.object({
  challengeId: z.string().min(1, "challengeId is required"),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;

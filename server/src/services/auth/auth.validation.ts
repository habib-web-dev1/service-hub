import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  phone: z.string().trim().optional(),

  role: z.enum(["CUSTOMER", "PROVIDER"]).optional().default("CUSTOMER"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),
});

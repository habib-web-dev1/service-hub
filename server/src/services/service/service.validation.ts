import { z } from "zod";

export const createServiceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Service title must be at least 3 characters")
    .max(150, "Service title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Service description must be at least 10 characters")
    .max(2000, "Service description must not exceed 2000 characters"),

  price: z.coerce.number().positive("Price must be greater than 0"),

  duration: z.coerce
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0")
    .optional(),

  categoryId: z.string().min(1, "Category ID is required"),

  providerId: z.string().min(1, "Provider ID is required"),
});

export const updateServiceSchema = createServiceSchema
  .omit({
    providerId: true,
  })
  .partial();

export const serviceQuerySchema = z.object({
  search: z.string().trim().optional(),

  categoryId: z.string().trim().optional(),

  providerId: z.string().trim().optional(),

  page: z.coerce.number().int().positive().optional().default(1),

  limit: z.coerce.number().int().positive().max(1000).optional().default(10),

  /** Admin only — include inactive services */
  includeInactive: z.coerce.boolean().optional().default(false),
});

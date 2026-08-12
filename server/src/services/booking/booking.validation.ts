import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  scheduledAt: z.coerce.date(),
  notes: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

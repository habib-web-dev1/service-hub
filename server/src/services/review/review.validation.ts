import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
    serviceId: z.string().min(1, "Service ID is required"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

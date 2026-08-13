import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import { bookingController } from "../services/booking/booking.controller.js";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../services/booking/booking.validation.js";

const router = Router();

router.use(authenticate);

// Create a booking
router.post(
  "/",
  authorize("CUSTOMER"),
  validateRequest({
    body: createBookingSchema,
  }),
  bookingController.createBooking,
);

// Get current customer's bookings
router.get("/my", authorize("CUSTOMER"), bookingController.getMyBookings);

// Get a single booking
router.get("/:id", bookingController.getBookingById);

// Update booking status
router.patch(
  "/:id/status",
  validateRequest({
    body: updateBookingStatusSchema,
  }),
  bookingController.updateBookingStatus,
);

// Cancel booking
router.patch(
  "/:id/cancel",
  authorize("CUSTOMER"),
  bookingController.cancelBooking,
);

export default router;

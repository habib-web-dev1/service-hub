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

router.post(
  "/",
  authorize("CUSTOMER"),
  validateRequest({
    body: createBookingSchema,
  }),
  bookingController.createBooking,
);

router.get("/my", authorize("CUSTOMER"), bookingController.getMyBookings);

router.get("/:id", bookingController.getBookingById);

router.patch(
  "/:id/status",
  validateRequest({
    body: updateBookingStatusSchema,
  }),
  bookingController.updateBookingStatus,
);

router.patch(
  "/:id/cancel",
  authorize("CUSTOMER"),
  bookingController.cancelBooking,
);

export default router;

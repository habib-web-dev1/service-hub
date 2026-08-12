import type { Response } from "express";

import type { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";
import { ApiResponse } from "../../lib/apiResponse.js";
import { catchAsync } from "../../lib/catchAsync.js";
import { bookingService } from "./booking.service.js";

const createBooking = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const booking = await bookingService.createBooking(
      req.user!.userId,
      req.body,
    );

    res
      .status(201)
      .json(new ApiResponse("Booking created successfully", booking));
  },
);

const getMyBookings = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const bookings = await bookingService.getMyBookings(req.user!.userId);

    res
      .status(200)
      .json(new ApiResponse("Bookings retrieved successfully", bookings));
  },
);

const getBookingById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const bookingId = String(req.params.id);

    const booking = await bookingService.getBookingById(
      bookingId,
      req.user!.userId,
      req.user!.role,
    );

    res
      .status(200)
      .json(new ApiResponse("Booking retrieved successfully", booking));
  },
);

const updateBookingStatus = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const bookingId = String(req.params.id);

    const booking = await bookingService.updateBookingStatus(
      bookingId,
      req.user!.userId,
      req.user!.role,
      req.body.status,
    );

    res
      .status(200)
      .json(new ApiResponse("Booking status updated successfully", booking));
  },
);

const cancelBooking = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const bookingId = String(req.params.id);

    const booking = await bookingService.cancelBooking(
      bookingId,
      req.user!.userId,
    );

    res
      .status(200)
      .json(new ApiResponse("Booking cancelled successfully", booking));
  },
);

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};

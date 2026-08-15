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
const getProviderBookings = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const bookings = await bookingService.getProviderBookings(req.user!.userId);

    res
      .status(200)
      .json(
        new ApiResponse("Provider bookings retrieved successfully", bookings),
      );
  },
);

const getAllBookings = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 1000; // default large limit or simple pagination

    const result = await bookingService.getAllBookings(page, limit);

    res
      .status(200)
      .json(new ApiResponse("All bookings retrieved successfully", result));
  },
);

export const bookingController = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};

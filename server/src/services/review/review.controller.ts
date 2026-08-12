import type { Response } from "express";

import type { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";
import { ApiResponse } from "../../lib/apiResponse.js";
import { catchAsync } from "../../lib/catchAsync.js";
import { reviewService } from "./review.service.js";

const createReview = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const review = await reviewService.createReview(req.user!.userId, req.body);

    res
      .status(201)
      .json(new ApiResponse("Review created successfully", review));
  },
);

const getServiceReviews = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const serviceId = String(req.params.serviceId);

    const reviews = await reviewService.getServiceReviews(serviceId);

    res
      .status(200)
      .json(new ApiResponse("Reviews retrieved successfully", reviews));
  },
);

const getReviewById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const reviewId = String(req.params.id);

    const review = await reviewService.getReviewById(
      reviewId,
      req.user!.userId,
      req.user!.role,
    );

    res
      .status(200)
      .json(new ApiResponse("Review retrieved successfully", review));
  },
);

const updateReview = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const reviewId = String(req.params.id);

    const review = await reviewService.updateReview(
      reviewId,
      req.user!.userId,
      req.body,
    );

    res
      .status(200)
      .json(new ApiResponse("Review updated successfully", review));
  },
);

const deleteReview = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const reviewId = String(req.params.id);

    await reviewService.deleteReview(
      reviewId,
      req.user!.userId,
      req.user!.role,
    );

    res.status(200).json(new ApiResponse("Review deleted successfully", null));
  },
);

export const reviewController = {
  createReview,
  getServiceReviews,
  getReviewById,
  updateReview,
  deleteReview,
};

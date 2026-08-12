import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/apiError.js";

interface CreateReviewInput {
  bookingId: string;
  serviceId: string;
  rating: number;
  comment?: string;
}

interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

const createReview = async (userId: string, data: CreateReviewInput) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: data.bookingId,
      customerId: userId,
      isDeleted: false,
      status: "COMPLETED",
    },
    include: {
      service: true,
    },
  });

  if (!booking) {
    throw new ApiError(
      404,
      "Completed booking not found or you do not have permission",
    );
  }

  if (booking.serviceId !== data.serviceId) {
    throw new ApiError(400, "Service does not belong to this booking");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId: data.bookingId,
    },
  });

  if (existingReview) {
    throw new ApiError(409, "A review already exists for this booking");
  }

  const review = await prisma.review.create({
    data: {
      bookingId: data.bookingId,
      serviceId: data.serviceId,
      userId,
      rating: data.rating,
      comment: data.comment ?? null,
    },
    include: {
      service: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

const getServiceReviews = async (serviceId: string) => {
  return prisma.review.findMany({
    where: {
      serviceId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getReviewById = async (
  reviewId: string,
  userId: string,
  role: string,
) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      isDeleted: false,
    },
    include: {
      service: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const isOwner = review.userId === userId;
  const isAdmin = role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have permission to access this review");
  }

  return review;
};

const updateReview = async (
  reviewId: string,
  userId: string,
  data: UpdateReviewInput,
) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const updatedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      ...(data.rating !== undefined && {
        rating: data.rating,
      }),
      ...(data.comment !== undefined && {
        comment: data.comment,
      }),
    },
    include: {
      service: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return updatedReview;
};

const deleteReview = async (reviewId: string, userId: string, role: string) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const isOwner = review.userId === userId;
  const isAdmin = role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have permission to delete this review");
  }

  await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return null;
};

export const reviewService = {
  createReview,
  getServiceReviews,
  getReviewById,
  updateReview,
  deleteReview,
};

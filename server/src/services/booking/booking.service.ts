import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/apiError.js";

interface CreateBookingInput {
  serviceId: string;
  scheduledAt: Date;
  notes?: string;
}

const createBooking = async (customerId: string, data: CreateBookingInput) => {
  const service = await prisma.service.findFirst({
    where: {
      id: data.serviceId,
      isActive: true,
      isDeleted: false,
    },
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const booking = await prisma.booking.create({
    data: {
      serviceId: data.serviceId,
      customerId,
      scheduledAt: data.scheduledAt,
      notes: data.notes ?? null,
    },
    include: {
      service: true,
    },
  });

  return booking;
};

const getMyBookings = async (customerId: string) => {
  return prisma.booking.findMany({
    where: {
      customerId,
      isDeleted: false,
    },
    include: {
      service: {
        include: {
          category: true,
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getBookingById = async (
  bookingId: string,
  userId: string,
  role: string,
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      isDeleted: false,
    },
    include: {
      service: {
        include: {
          category: true,
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isCustomer = booking.customerId === userId;
  const isProvider = booking.service.providerId === userId;
  const isAdmin = role === "ADMIN";

  if (!isCustomer && !isProvider && !isAdmin) {
    throw new ApiError(
      403,
      "You do not have permission to access this booking",
    );
  }

  return booking;
};

const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  role: string,
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      isDeleted: false,
    },
    include: {
      service: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isProvider = booking.service.providerId === userId;
  const isCustomer = booking.customerId === userId;
  const isAdmin = role === "ADMIN";

  if (!isProvider && !isCustomer && !isAdmin) {
    throw new ApiError(
      403,
      "You do not have permission to update this booking",
    );
  }

  if (isCustomer && status !== "CANCELLED") {
    throw new ApiError(403, "Customers can only cancel their bookings");
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
    include: {
      service: true,
    },
  });

  return updatedBooking;
};

const cancelBooking = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId,
      isDeleted: false,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status === "COMPLETED") {
    throw new ApiError(400, "Completed booking cannot be cancelled");
  }

  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
    },
  });
};
const getProviderBookings = async (providerId: string) => {
  return prisma.booking.findMany({
    where: {
      isDeleted: false,
      service: {
        providerId,
        isDeleted: false,
      },
    },
    include: {
      service: {
        include: {
          category: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllBookings = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: {
        isDeleted: false,
      },
      skip,
      take: limit,
      include: {
        service: {
          include: {
            category: true,
            provider: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.booking.count({
      where: {
        isDeleted: false,
      },
    }),
  ]);

  return {
    data: bookings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};

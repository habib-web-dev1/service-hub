import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/apiError.js";

const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const updateUser = async (
  userId: string,
  data: {
    name?: string;
    phone?: string | null;
  },
) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),
      ...(data.phone !== undefined && {
        phone: data.phone,
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return null;
};

const getUsers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.user.count({
      where: {
        isDeleted: false,
      },
    }),
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const userService = {
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
};

import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/apiError.js";

interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
}

const createCategory = async (data: CreateCategoryInput) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: data.slug }],
    },
  });

  if (existingCategory) {
    if (existingCategory.isDeleted) {
      throw new ApiError(
        409,
        "Category already exists but is deleted. Restore it first.",
      );
    }

    throw new ApiError(409, "Category with this name or slug already exists");
  }

  return prisma.category.create({
    data,
  });
};

const getCategories = async () => {
  return prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

const updateCategory = async (id: string, data: UpdateCategoryInput) => {
  await getCategoryById(id);

  if (data.name || data.slug) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          data.name ? { name: data.name } : undefined,
          data.slug ? { slug: data.slug } : undefined,
        ].filter(Boolean) as object[],
        isDeleted: false,
        NOT: {
          id,
        },
      },
    });

    if (existingCategory) {
      throw new ApiError(
        409,
        "Another category with this name or slug already exists",
      );
    }
  }

  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
};

const deleteCategory = async (id: string) => {
  await getCategoryById(id);

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};

const restoreCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (!category.isDeleted) {
    throw new ApiError(400, "Category is already active");
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
};

export const categoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory,
};

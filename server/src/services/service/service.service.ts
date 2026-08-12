import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/apiError.js";
interface CreateServiceInput {
  title: string;
  description: string;
  price: number;
  duration?: number;
  categoryId: string;
  providerId: string;
}
interface UpdateServiceInput {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  categoryId?: string;
  isActive?: boolean;
}
interface ServiceQueryInput {
  search?: string;
  categoryId?: string;
  providerId?: string;
  page: number;
  limit: number;
}
const ensureCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, isDeleted: false },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return category;
};
const ensureProviderExists = async (providerId: string) => {
  const provider = await prisma.user.findFirst({
    where: { id: providerId, role: "PROVIDER", isDeleted: false },
  });
  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }
  return provider;
};
const createService = async (data: CreateServiceInput) => {
  await ensureCategoryExists(data.categoryId);
  await ensureProviderExists(data.providerId);
  return prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      duration: data.duration ?? null,
      categoryId: data.categoryId,
      providerId: data.providerId,
    },
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
};
const getServices = async (query?: ServiceQueryInput) => {
  const { search, categoryId, providerId, page = 1, limit = 10 } = query ?? {};
  const where = {
    isDeleted: false,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(providerId ? { providerId } : {}),
  };
  const skip = (page - 1) * limit;
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        provider: { select: { id: true, name: true } },
      },
    }),
    prisma.service.count({ where }),
  ]);
  return {
    data: services,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
const getServiceById = async (id: string) => {
  const service = await prisma.service.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: {
        select: { id: true, name: true, slug: true, description: true },
      },
      provider: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  return service;
};
const updateService = async (id: string, data: UpdateServiceInput) => {
  await getServiceById(id);
  if (data.categoryId) {
    await ensureCategoryExists(data.categoryId);
  }
  return prisma.service.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
};
const deleteService = async (id: string) => {
  await getServiceById(id);
  return prisma.service.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date(), isActive: false },
  });
};
export const serviceService = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};

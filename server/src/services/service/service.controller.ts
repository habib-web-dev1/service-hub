import type { Request, Response } from "express";

import { ApiResponse } from "../../lib/apiResponse.js";
import { catchAsync } from "../../lib/catchAsync.js";
import { ApiError } from "../../lib/apiError.js";
import { serviceService } from "./service.service.js";
import type { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";
const createService = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceService.createService(req.body);

  res
    .status(201)
    .json(new ApiResponse("Service created successfully", service));
});

const getServices = catchAsync(async (req: Request, res: Response) => {
  const query = res.locals.query ?? {
    ...req.query,
    page: req.query.page ?? 1,
    limit: req.query.limit ?? 10,
  };

  const result = await serviceService.getServices(query);

  res
    .status(200)
    .json(new ApiResponse("Services retrieved successfully", result));
});

const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new ApiError(400, "Invalid service ID");
  }
  const service = await serviceService.getServiceById(id);

  res
    .status(200)
    .json(new ApiResponse("Service retrieved successfully", service));
});

const updateService = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new ApiError(400, "Invalid service ID");
    }

    const service = await serviceService.updateService(
      id,
      req.user!.userId,
      req.body,
    );

    res
      .status(200)
      .json(new ApiResponse("Service updated successfully", service));
  },
);
const deleteService = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new ApiError(400, "Invalid service ID");
    }

    await serviceService.deleteService(id, req.user!.userId);

    res.status(200).json(new ApiResponse("Service deleted successfully", null));
  },
);

export const serviceController = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};

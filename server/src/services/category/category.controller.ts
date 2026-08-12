import type { Request, Response } from "express";

import { ApiResponse } from "../../lib/apiResponse.js";
import { catchAsync } from "../../lib/catchAsync.js";
import { categoryService } from "./category.service.js";
import { ApiError } from "../../lib/apiError.js";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new ApiError(400, "Invalid category ID");
  }
  const category = await categoryService.createCategory(req.body);

  res
    .status(201)
    .json(new ApiResponse("Category created successfully", category));
});

const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getCategories();

  res
    .status(200)
    .json(new ApiResponse("Categories retrieved successfully", categories));
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new ApiError(400, "Invalid category ID");
  }
  const category = await categoryService.getCategoryById(id);

  res
    .status(200)
    .json(new ApiResponse("Category retrieved successfully", category));
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new ApiError(400, "Invalid category ID");
  }
  const category = await categoryService.updateCategory(id, req.body);

  res
    .status(200)
    .json(new ApiResponse("Category updated successfully", category));
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new ApiError(400, "Invalid category ID");
  }
  await categoryService.deleteCategory(id);

  res.status(200).json(new ApiResponse("Category deleted successfully", null));
});

const restoreCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new ApiError(400, "Invalid category ID");
  }
  const category = await categoryService.restoreCategory(id);

  res
    .status(200)
    .json(new ApiResponse("Category restored successfully", category));
});

export const categoryController = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory,
};

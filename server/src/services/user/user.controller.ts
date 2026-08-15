import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";
import { ApiResponse } from "../../lib/apiResponse.js";
import { catchAsync } from "../../lib/catchAsync.js";
import { userService } from "./user.service.js";

const getMe = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.getUserById(req.user!.userId);

  res.status(200).json(new ApiResponse("User retrieved successfully", user));
});

const updateMe = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await userService.updateUser(req.user!.userId, req.body);

    res.status(200).json(new ApiResponse("User updated successfully", user));
  },
);

const deleteMe = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    await userService.deleteUser(req.user!.userId);

    res.status(200).json(new ApiResponse("User deleted successfully", null));
  },
);

const becomeProvider = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await userService.becomeProvider(req.user!.userId);

    res
      .status(200)
      .json(new ApiResponse("User upgraded to provider successfully", user));
  },
);

const getUsers = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const result = await userService.getUsers(page, limit);

    res
      .status(200)
      .json(new ApiResponse("Users retrieved successfully", result));
  },
);

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await userService.deleteUser(id);

  res.status(200).json(new ApiResponse("User deleted successfully", null));
});

const changePassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    await userService.changePassword(req.user!.userId, req.body);

    res
      .status(200)
      .json(new ApiResponse("Password changed successfully", null));
  },
);

export const userController = {
  getMe,
  updateMe,
  deleteMe,
  becomeProvider,
  getUsers,
  deleteUser,
  changePassword,
};

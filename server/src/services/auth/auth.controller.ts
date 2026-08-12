import type { Request, Response } from "express";

import { ApiResponse } from "../../lib/apiResponse.js";
import { catchAsync } from "../../lib/catchAsync.js";
import { authService } from "./auth.service.js";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  res.status(201).json(new ApiResponse("Registration successful", result));
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.status(200).json(new ApiResponse("Login successful", result));
});

export const authController = {
  register,
  login,
};

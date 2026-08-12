import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequest.js";
import { authController } from "../services/auth/auth.controller.js";
import {
  loginSchema,
  registerSchema,
} from "../services/auth/auth.validation.js";

const router = Router();

router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  authController.register,
);

router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  authController.login,
);

export default router;

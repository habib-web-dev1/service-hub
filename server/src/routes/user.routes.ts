import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import { userController } from "../services/user/user.controller.js";
import {
  updateUserSchema,
  userQuerySchema,
} from "../services/user/user.validation.js";

const router = Router();

// Get current logged-in user
router.get("/me", authenticate, userController.getMe);

// Update current logged-in user
router.patch(
  "/me",
  authenticate,
  validateRequest({
    body: updateUserSchema,
  }),
  userController.updateMe,
);

// Delete current logged-in user
router.delete("/me", authenticate, userController.deleteMe);

// Admin: get all users
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  validateRequest({
    query: userQuerySchema,
  }),
  userController.getUsers,
);

export default router;

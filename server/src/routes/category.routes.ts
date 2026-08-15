import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequest.js";

import { categoryController } from "../services/category/category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../services/category/category.validation.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validateRequest({
    body: createCategorySchema,
  }),
  categoryController.createCategory,
);

router.get("/", categoryController.getCategories);

router.patch(
  "/:id/restore",
  authenticate,
  authorize("ADMIN"),
  categoryController.restoreCategory,
);

router.get("/:id", authenticate, categoryController.getCategoryById);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validateRequest({
    body: updateCategorySchema,
  }),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.deleteCategory,
);

export default router;

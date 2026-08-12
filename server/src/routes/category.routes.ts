import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequest.js";

import { categoryController } from "../services/category/category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../services/category/category.validation.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();

router.post(
  "/",
  validateRequest({
    body: createCategorySchema,
  }),
  categoryController.createCategory,
);

router.get("/", categoryController.getCategories);

router.patch("/:id/restore", categoryController.restoreCategory);

router.get("/:id", authenticate, categoryController.getCategoryById);

router.patch(
  "/:id",
  validateRequest({
    body: updateCategorySchema,
  }),
  categoryController.updateCategory,
);

router.delete("/:id", categoryController.deleteCategory);

export default router;

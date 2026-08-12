import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import { reviewController } from "../services/review/review.controller.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../services/review/review.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest({
    body: createReviewSchema.shape.body,
  }),
  reviewController.createReview,
);

router.get("/service/:serviceId", reviewController.getServiceReviews);

router.get("/:id", authenticate, reviewController.getReviewById);

router.patch(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest({
    body: updateReviewSchema.shape.body,
  }),
  reviewController.updateReview,
);

router.delete("/:id", authenticate, reviewController.deleteReview);

export default router;

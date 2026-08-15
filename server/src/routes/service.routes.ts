import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import { serviceController } from "../services/service/service.controller.js";
import {
  createServiceSchema,
  serviceQuerySchema,
  updateServiceSchema,
} from "../services/service/service.validation.js";

const router = Router();

// Get all services
router.get(
  "/",
  validateRequest({
    query: serviceQuerySchema,
  }),
  serviceController.getServices,
);

// Get services for logged-in provider
router.get(
  "/my",
  authenticate,
  authorize("PROVIDER"),
  serviceController.getMyServices,
);

// Get service by ID
router.get("/:id", serviceController.getServiceById);

// Create service
router.post(
  "/",
  authenticate,
  authorize("PROVIDER"),
  validateRequest({
    body: createServiceSchema,
  }),
  serviceController.createService,
);

// Update service
router.patch(
  "/:id",
  authenticate,
  authorize("PROVIDER"),
  validateRequest({
    body: updateServiceSchema,
  }),
  serviceController.updateService,
);

// Delete service
router.delete(
  "/:id",
  authenticate,
  authorize("PROVIDER"),
  serviceController.deleteService,
);

export default router;

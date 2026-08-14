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

router.post(
  "/",
  authenticate,
  authorize("PROVIDER"),
  validateRequest({
    body: createServiceSchema,
  }),
  serviceController.createService,
);

router.get(
  "/",
  validateRequest({
    query: serviceQuerySchema,
  }),
  serviceController.getServices,
);

router.get(
  "/my",
  authenticate,
  authorize("PROVIDER"),
  serviceController.getMyServices,
);

router.get("/:id", serviceController.getServiceById);

router.patch(
  "/:id",
  authenticate,
  authorize("PROVIDER"),
  validateRequest({
    body: updateServiceSchema,
  }),
  serviceController.updateService,
);

router.delete(
  "/:id",
  authenticate,
  authorize("PROVIDER"),
  serviceController.deleteService,
);

export default router;

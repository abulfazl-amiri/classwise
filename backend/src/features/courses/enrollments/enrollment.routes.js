import { Router } from "express";
import * as enrollmentController from "./enrollment.controller.js";

import { validateBody } from "../../../middleware/validation.middleware.js";
import { createSchema, updateSchema } from "./enrollment.schema.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(validateBody(createSchema), enrollmentController.create)
  .get(enrollmentController.getAll);

router
  .route("/:id")
  .get(enrollmentController.getOne)
  .patch(validateBody(updateSchema), enrollmentController.updateOne)
  .delete(enrollmentController.deleteOne);

export default router;

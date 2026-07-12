import { Router } from "express";
import { validateBody } from "../../../middleware/validation.middleware.js";
import * as timetableController from "./timetable.controller.js";
import { createSchema, updateSchema } from "./timetable.schema.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(validateBody(createSchema), timetableController.create)
  .get(timetableController.getByCourseId)
  .patch(validateBody(updateSchema), timetableController.updateByCourseId);

export default router;

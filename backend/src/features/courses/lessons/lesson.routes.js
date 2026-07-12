import { Router } from "express";
import * as lessonController from "./lesson.controller.js";
import { validateBody } from "../../../middleware/validation.middleware.js";
import { createSchema, updateSchema } from "./lesson.schema.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(validateBody(createSchema), lessonController.create)
  .get(lessonController.getAll);

router
  .route("/:id")
  .get(lessonController.getOne)
  .patch(validateBody(updateSchema), lessonController.updateOne)
  .delete(lessonController.deleteOne);

export default router;

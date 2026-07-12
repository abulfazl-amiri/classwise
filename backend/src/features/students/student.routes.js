import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validateBody } from "../../middleware/validation.middleware.js";
import * as studentController from "./student.controller.js";
import { createSchema, updateSchema } from "./student.schema.js";

const router = Router();
router.use(authenticate);

router
  .route("/")
  .post(validateBody(createSchema), studentController.create)
  .get(studentController.getAll);
router
  .route("/:id")
  .get(studentController.getOne)
  .patch(validateBody(updateSchema), studentController.updateOne)
  .delete(studentController.deleteOne);

router.route("/:id/enrollments").get(studentController.getEnrollments);

export default router;

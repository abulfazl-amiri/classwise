import { Router } from "express";
import * as nonTeachingDayController from "./nonTeachingDay.controller.js";
import { validateBody } from "../../middleware/validation.middleware.js";
import { createSchema, updateSchema } from "./nonTeachingDay.schema.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeCourses } from "./nonTeachingDay.middleware.js";

const router = Router();
router.use(authenticate);

router
  .route("/")
  .post(validateBody(createSchema), authorizeCourses, nonTeachingDayController.create)
  .get(authorizeCourses, nonTeachingDayController.getAll);

router
  .route("/:id")
  .get(authorizeCourses, nonTeachingDayController.getOne)
  .patch(validateBody(updateSchema), authorizeCourses, nonTeachingDayController.updateOne)
  .delete(authorizeCourses, nonTeachingDayController.deleteOne);

export default router;

import { Router } from "express";

import * as courseController from "./course.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeCourseTeacher, authorizeCourseOwner } from "./course.middleware.js";

import { validateBody } from "../../middleware/validation.middleware.js";
import { createSchema, updateSchema } from "./course.schema.js";

import lessonRouter from "./lessons/lesson.routes.js";
import timetableRouter from "./timetable/timetable.routes.js";
import enrollmentRouter from "./enrollments/enrollment.routes.js";
import courseInviteRouter from "./invites/routes/courseInvite.routes.js";

const router = Router();
router.use(authenticate);

router
  .route("/")
  .post(validateBody(createSchema), courseController.create)
  .get(courseController.getAll);
router
  .route("/:id")
  .get(authorizeCourseTeacher, courseController.getOne)
  .patch(authorizeCourseTeacher, validateBody(updateSchema), courseController.updateOne)
  .delete(authorizeCourseOwner, courseController.deleteOne);

router.route("/:id/teachers").get(authorizeCourseTeacher, courseController.getTeachers);

router.use("/:courseId/timetable", authorizeCourseTeacher, timetableRouter);
router.use("/:courseId/lessons", authorizeCourseTeacher, lessonRouter);
router.use("/:courseId/enrollments", authorizeCourseTeacher, enrollmentRouter);
router.use("/:courseId/invites", authorizeCourseOwner, courseInviteRouter);

export default router;

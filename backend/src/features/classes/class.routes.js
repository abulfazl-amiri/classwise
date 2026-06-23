import { Router } from "express";

import * as classController from "./class.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import * as classValidator from "./class.validator.js";

const router = Router();

router
  .route("/")
  .post(authenticate, classValidator.create, classController.create)
  .get(authenticate, classController.getAll);
router
  .route("/:id")
  .get(authenticate, classController.getOne)
  .patch(authenticate, classValidator.updateOne, classController.updateOne)
  .delete(authenticate, classController.deleteOne);

// router
//   .route("/:id/lessons")
//   .post(authenticate, classValidator.createLesson, classController.createLesson);

export default router;

import { Router } from "express";

import * as resourceController from "./resource.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as resourceValidator from "./resource.validator.js";
import { handleValidationErrors } from "../../utils/validation.util.js";
const router = Router();

router
  .route("/recent")
  .get(authenticate, resourceController.aliasRecent, resourceController.getAll);

router
  .route("/")
  .post(authenticate, resourceValidator.create, handleValidationErrors, resourceController.create)
  .get(authenticate, resourceController.getAll);
router
  .route("/:id")
  .get(authenticate, resourceController.getOne)
  .patch(
    authenticate,
    resourceValidator.updateOne,
    handleValidationErrors,
    resourceController.updateOne,
  )
  .delete(authenticate, resourceController.deleteOne);

export default router;

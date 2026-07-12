import { Router } from "express";

import * as resourceAccessController from "./resourceAccess.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../../../middleware/validation.middleware.js";
import { grantSchema, resourceIdSchema, revokeParamsSchema } from "./resourceAccess.schema.js";

const router = Router({ mergeParams: true });
router.use(authenticate);

router
  .route("/")
  .get(validateParams(resourceIdSchema), resourceAccessController.listAccess)
  .post(validateBody(grantSchema), resourceAccessController.grantAccess);

router
  .route("/:teacherId")
  .delete(validateParams(revokeParamsSchema), resourceAccessController.revokeAccess);

export default router;

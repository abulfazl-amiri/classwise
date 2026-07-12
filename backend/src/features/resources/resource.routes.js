import { Router } from "express";

import * as resourceController from "./resource.controller.js";
import resourceAccessRouter from "./access/resourceAccess.routes.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../../middleware/validation.middleware.js";
import { createSchema, updateSchema } from "./resource.schema.js";
import { resourceIdSchema } from "./resource.schema.js";

const router = Router();
router.use(authenticate);

router.route("/recent").get(resourceController.aliasRecent, resourceController.getAll);

router
  .route("/")
  .post(validateBody(createSchema), resourceController.create)
  .get(resourceController.getAll);
router.use("/:resourceId/access", resourceAccessRouter);

router
  .route("/:id")
  .get(validateParams(resourceIdSchema), resourceController.getOne)
  .patch(validateParams(resourceIdSchema), validateBody(updateSchema), resourceController.updateOne)
  .delete(validateParams(resourceIdSchema), resourceController.deleteOne);

export default router;

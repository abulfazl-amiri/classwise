import { Router } from "express";
import * as inviteController from "../invite.controller.js";
import { validateBody } from "../../../../middleware/validation.middleware.js";
import { createSchema } from "../invite.schema.js";

const router = Router({ mergeParams: true });

router.route("/").post(validateBody(createSchema), inviteController.create);

export default router;

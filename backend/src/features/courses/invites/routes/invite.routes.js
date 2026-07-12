import { Router } from "express";

import * as inviteController from "../invite.controller.js";
import { authenticate } from "../../../../middleware/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.route("/").get(inviteController.getAll);
router.route("/:id/accept").post(inviteController.accept);
router.route("/:id/reject").post(inviteController.reject);

export default router;

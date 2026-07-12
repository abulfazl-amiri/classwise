import { Router } from "express";

import * as sessionController from "./session.controller.js";
import { authenticate, requireSudoMode } from "../../middleware/auth.middleware.js";
import { requireRefreshToken } from "../auth/auth.middleware.js";

const router = Router();
router.use(authenticate);

router
  .route("/")
  .get(requireRefreshToken, sessionController.getAll)
  .delete(requireSudoMode, sessionController.revokeAllSessions);
router
  .route("/:id")
  .get(sessionController.getById)
  .delete(requireSudoMode, sessionController.deleteById);
export default router;

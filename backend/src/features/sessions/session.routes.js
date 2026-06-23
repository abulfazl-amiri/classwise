import { Router } from "express";

import * as sessionController from "./session.controller.js";
import * as sessionValidator from "./session.validator.js";
import { authenticate, requireSudoMode } from "../../middleware/auth.middleware.js";

import { handleValidationErrors } from "../../utils/validation.util.js";

const router = Router();

router
  .route("/")
  .get(authenticate, sessionValidator.getAll, handleValidationErrors, sessionController.getAll)
  .delete(
    authenticate,
    requireSudoMode,
    sessionValidator.revokeAllSessions,
    handleValidationErrors,
    sessionController.revokeAllSessions,
  );
router
  .route("/:id")
  .get(authenticate, sessionValidator.getById, handleValidationErrors, sessionController.getById)
  .delete(
    authenticate,
    requireSudoMode,
    sessionValidator.deleteById,
    handleValidationErrors,
    sessionController.deleteById,
  );
export default router;

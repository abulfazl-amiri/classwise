import { Router } from "express";

import * as authController from "./auth.controller.js";

import * as authValidator from "./auth.validator.js";
import { handleValidationErrors } from "../../utils/validation.util.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(authValidator.signup, handleValidationErrors, authController.signup);
router.route("/signin").post(authValidator.signin, handleValidationErrors, authController.signin);
router.route("/logout").post(authValidator.logout, handleValidationErrors, authController.logout);
router
  .route("/refresh")
  .post(authValidator.refresh, handleValidationErrors, authController.refresh);

// reset password
router
  .route("/password/forgot")
  .post(authValidator.forgotPassword, handleValidationErrors, authController.forgotPassword);
router
  .route("/password/reset")
  .post(authValidator.resetPassword, handleValidationErrors, authController.resetPassword);

router
  .route("/confirm-password")
  .post(
    authenticate,
    authValidator.confirmPassword,
    handleValidationErrors,
    authController.confirmPassword,
  );
export default router;

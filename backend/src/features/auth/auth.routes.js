import { Router } from "express";

import * as authController from "./auth.controller.js";

import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  confirmPasswordSchema,
} from "./auth.schema.js";
import { validateBody } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRefreshToken } from "./auth.middleware.js";

const router = Router();

router.route("/signup").post(validateBody(signupSchema), authController.signup);
router.route("/signin").post(validateBody(signinSchema), authController.signin);
router.route("/logout").post(requireRefreshToken, authController.logout);
router.route("/refresh").post(requireRefreshToken, authController.refresh);

// reset password
router
  .route("/password/forgot")
  .post(validateBody(forgotPasswordSchema), authController.forgotPassword);
router
  .route("/password/reset")
  .post(validateBody(resetPasswordSchema), authController.resetPassword);

// sudo token
router
  .route("/confirm-password")
  .post(authenticate, validateBody(confirmPasswordSchema), authController.confirmPassword);
export default router;

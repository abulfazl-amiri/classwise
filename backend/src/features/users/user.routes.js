import { Router } from "express";

import {
  refreshToken,
  signup,
  signin,
  getAllUsers,
  getById,
  updateById,
  deleteById,
  updateUserRole,
  updateUserPassword,
  forgotPassword,
  resetPassword,
} from "./user.controller.js";
import { authenticate, restrictTo, setMeId } from "../../middleware/authMiddleware.js";

const router = Router();

router.route("/refresh").post(refreshToken);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").post(resetPassword);

router.route("/signup").post(signup);
router.route("/signin").post(signin);

router.route("/users").get(authenticate, restrictTo("admin"), getAllUsers);
router
  .route("/users/:id")
  .get(authenticate, restrictTo("admin"), getById)
  .patch(authenticate, restrictTo("admin"), updateById)
  .delete(authenticate, restrictTo("admin"), deleteById);
router.route("/users/:id/role").patch(authenticate, restrictTo("admin"), updateUserRole);

router
  .route("/me")
  .get(authenticate, setMeId, getById)
  .patch(authenticate, setMeId, updateById)
  .delete(authenticate, setMeId, deleteById);
router.route("/me/change-password").patch(authenticate, updateUserPassword);

export default router;

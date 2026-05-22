import { Router } from "express";

import {
  signup,
  signin,
  getAllUsers,
  getById,
  updateById,
  deleteById,
  updateUsreRole,
  updateUserPassword,
} from "../controllers/userController.js";
import { authenticate, restrictTo, setMeId } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);

router.route("/users").get(authenticate, restrictTo("admin"), getAllUsers);
router
  .route("/users/:id")
  .get(authenticate, restrictTo("admin"), getById)
  .patch(authenticate, restrictTo("admin"), updateById)
  .delete(authenticate, restrictTo("admin"), deleteById);
router.route("/users/:id/role").patch(authenticate, restrictTo("admin"), updateUsreRole);

router
  .route("/me")
  .get(authenticate, setMeId, getById)
  .patch(authenticate, setMeId, updateById)
  .delete(authenticate, setMeId, deleteById);
router.route("/me/change-password").patch(authenticate, updateUserPassword);

export default router;

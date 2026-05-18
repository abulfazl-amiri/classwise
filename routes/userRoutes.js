import { Router } from "express";

import {
  signup,
  signin,
  getAllUsers,
  getById,
  updateById,
  deleteById,
} from "../controllers/userController.js";
import { authenticate, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/users").get(authenticate, restrictTo("admin"), getAllUsers);
router
  .route("/users/:id")
  .get(authenticate, restrictTo("admin"), getById)
  .patch(authenticate, restrictTo("admin"), updateById)
  .delete(authenticate, restrictTo("admin"), deleteById);

export default router;

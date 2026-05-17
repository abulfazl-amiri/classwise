import { Router } from "express";

import {
  signup,
  signin,
  getAllUsers,
  getById,
  updateById,
  deleteById,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/users").get(authenticate, getAllUsers);
router
  .route("users/:id")
  .get(authenticate, getById)
  .patch(authenticate, updateById)
  .delete(authenticate, deleteById);

export default router;

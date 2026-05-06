import { Router } from "express";

import {
  createResource,
  getAllResource,
  getById,
  updateById,
  deleteById,
} from "../controllers/resourceController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.route("/").post(authenticate, createResource).get(authenticate, getAllResource);
router
  .route("/:id")
  .get(authenticate, getById)
  .patch(authenticate, updateById)
  .delete(authenticate, deleteById);

export default router;

import { Router } from "express";

import {
  aliasRecent,
  createResource,
  getAllResource,
  getById,
  updateById,
  deleteById,
} from "../controllers/resourceController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.route("/recent").get(authenticate, aliasRecent, getAllResource);

router.route("/").post(authenticate, createResource).get(authenticate, getAllResource);
router
  .route("/:id")
  .get(authenticate, getById)
  .patch(authenticate, updateById)
  .delete(authenticate, deleteById);

export default router;

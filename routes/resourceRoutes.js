import { Router } from "express";

import {
  createResource,
  getAllResource,
  getById,
  updateById,
  deleteById,
} from "../controllers/resourceController.js";

const router = Router();

router.route("/").post(createResource).get(getAllResource);
router.route("/:id").get(getById).patch(updateById).delete(deleteById);

export default router;

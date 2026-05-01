import { Router } from "express";

import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

const router = Router();

router.route("/").post(createClass).get(getAllClasses);
router.route("/:id").get(getClassById).patch(updateClass).delete(deleteClass);

export default router;

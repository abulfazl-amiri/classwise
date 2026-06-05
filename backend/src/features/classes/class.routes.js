import { Router } from "express";

import { createClass, getAllClasses, getById, updateById, deleteById } from "./class.controller.js";

import { authenticate } from "../../middleware/authMiddleware.js";
const router = Router();

router.route("/").post(authenticate, createClass).get(authenticate, getAllClasses);
router
  .route("/:id")
  .get(authenticate, getById)
  .patch(authenticate, updateById)
  .delete(authenticate, deleteById);

export default router;

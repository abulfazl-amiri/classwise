import { Router } from "express";

import * as userController from "./user.controller.js";
import { updateSchema, changePasswordSchema, updateRoleSchema } from "./user.schema.js";
import { authenticate, requireRole, setMeId } from "../../middleware/auth.middleware.js";
import { validateBody } from "../../middleware/validation.middleware.js";

const router = Router();

router.use(authenticate);
router
  .route("/me")
  .get(setMeId, userController.getById)
  .patch(setMeId, validateBody(updateSchema), userController.updateById)
  .delete(setMeId, userController.deleteById);
router
  .route("/me/change-password")
  .patch(validateBody(changePasswordSchema), userController.changePassword);

// only admin
router.route("/").get(requireRole("admin"), userController.getAll);
router
  .route("/:id")
  .get(requireRole("admin"), userController.getById)
  .patch(requireRole("admin"), validateBody(updateSchema), userController.updateById)
  .delete(requireRole("admin"), userController.deleteById);
router
  .route("/:id/role")
  .patch(requireRole("admin"), validateBody(updateRoleSchema), userController.updateUserRole);

export default router;

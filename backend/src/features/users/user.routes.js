import { Router } from "express";

import * as userController from "./user.controller.js";
import * as userValidator from "./user.validator.js";
import { authenticate, requireRole, setMeId } from "../../middleware/auth.middleware.js";

const router = Router();

router
  .route("/me")
  .get(authenticate, setMeId, userController.getById)
  .patch(authenticate, setMeId, userController.updateById)
  .delete(authenticate, setMeId, userController.deleteById);
router
  .route("/me/change-password")
  .patch(authenticate, userValidator.changePassword, userController.changePassword);

// only admin
router.route("/").get(authenticate, requireRole("admin"), userController.getAllUsers);
router
  .route("/:id")
  .get(authenticate, requireRole("admin"), userController.getById)
  .patch(authenticate, requireRole("admin"), userController.updateById)
  .delete(authenticate, requireRole("admin"), userController.deleteById);
router
  .route("/:id/role")
  .patch(
    authenticate,
    requireRole("admin"),
    userValidator.updateRole,
    userController.updateUserRole,
  );

export default router;

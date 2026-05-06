import { Router } from "express";

import { signup, signin } from "../controllers/userController.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);

export default router;

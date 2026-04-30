import { Router } from "express";

import { createClass } from "../controllers/classController.js";

const router = Router();

router.post("/", createClass);

export default router;

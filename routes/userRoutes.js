import { Router } from "express";

import { signup, signin } from "../controllers/userController.js";

const route = Router();

route.route("/signup").post(signup);
route.route("/signin").post(signin);

export default route;

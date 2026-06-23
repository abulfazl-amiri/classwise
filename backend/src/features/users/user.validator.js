import { body } from "express-validator";

const updateRole = [
  body("role")
    .notEmpty()
    .withMessage("role is missing")
    .isIn(["admin", "user"])
    .withMessage("role must by in: [admin, user]"),
];

const changePassword = [
  body("oldPassword").notEmpty().withMessage("old password is missing"),
  body("newPassword")
    .notEmpty()
    .withMessage("newPassword is missing")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export { updateRole, changePassword };

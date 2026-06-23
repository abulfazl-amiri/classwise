import { body, cookie } from "express-validator";

const signup = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is missing")
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("password is missing")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const signin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is missing")
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("password is missing"),
];

const forgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is missing")
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email"),
];

const resetPassword = [
  body("newPassword")
    .notEmpty()
    .withMessage("newPassword is missing")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("resetToken").notEmpty().withMessage("resetToken is missing"),
];

const logout = [
  cookie("refreshToken").notEmpty().withMessage("refreshToken is missing from the cookies."),
];

const refresh = [
  cookie("refreshToken").notEmpty().withMessage("refreshToken is missing from the cookies."),
];

const confirmPassword = [body("password").notEmpty().withMessage("password is missing")];

export { signup, signin, forgotPassword, resetPassword, logout, refresh, confirmPassword };

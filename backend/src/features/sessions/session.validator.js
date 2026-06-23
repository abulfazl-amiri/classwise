import { body, cookie, param } from "express-validator";

const getAll = [
  cookie("refreshToken").notEmpty().withMessage("refreshToken is missing from the cookies"),
];
const revokeAllSessions = [
  cookie("sudoToken").notEmpty().withMessage("sudoToken is missing from the cookies"),
];

const getById = [param("id").notEmpty().withMessage("id is missing from the params")];

const deleteById = [
  param("id").notEmpty().withMessage("id is missing from the params"),
  cookie("sudoToken").notEmpty().withMessage("sudoToken is missing from the cookies"),
];

export { getAll, revokeAllSessions, getById, deleteById };

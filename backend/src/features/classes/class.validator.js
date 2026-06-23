import { body } from "express-validator";

const create = [
  body("name").notEmpty().withMessage("Name is missing"),
  body("subject").notEmpty().withMessage("Subject is missing"),

  body("resources").optional().isArray().withMessage("Resources msut be an array "),
  body("resources.*.resource").notEmpty().withMessage("Resource is required for each entry"),
  body("resources.*.currentPage")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Current page must be a non-negative integer for each entry"),
  body("resources.*.currentUnit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Current unit must be a non-negative integer for each entry"),

  body("startTime")
    .optional()
    .isInt({ min: 0, max: 1430 })
    .withMessage("Start time cannot be less than 0 (00:00) or exceed 1439 (23:59)"),
  body("endTime")
    .optional()
    .isInt({ min: 0, max: 1439 })
    .withMessage("Start time cannot be less than 0 (00:00) or exceed 1439 (23:59)"),

  body("students")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Students must be a non-negative integer"),
];

const createLesson = [
  body("date")
    .notEmpty()
    .withMessage("Date is required on each last lesson")
    .isISO8601()
    .withMessage(
      "Date for last lesson must be a valid date format as: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ",
    ),
  body("lastLesson.note").optional().isString().withMessage("Note must be a string"),
  body("lastLesson.plan").optional().isString().withMessage("Plan must be a string"),
];

const updateOne = [
  body("name").optional().notEmpty().withMessage("Name is missing"),
  body("subject").optional().notEmpty().withMessage("Subject is missing"),

  body("resources").optional().isArray().withMessage("Resources must be an array "),
  body("resources.*.resource")
    .optional()
    .notEmpty()
    .withMessage("Resource is required for each entry"),
  body("resources.*.currentPage")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Current page must be a non-negative integer for each entry"),
  body("resources.*.currentUnit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Current unit must be a non-negative integer for each entry"),

  body("startTime")
    .optional()
    .isInt({ min: 0, max: 1439 })
    .withMessage("Start time cannot be less than 0 (00:00) or exceed 1439 (23:59)"),
  body("endTime")
    .optional()
    .isInt({ min: 0, max: 1439 })
    .withMessage("End time cannot be less than 0 (00:00) or exceed 1439 (23:59)"),
  body("lastLesson.date")
    .if((value, { req }) => req.body.lastLesson !== undefined)
    .notEmpty()
    .withMessage("Date is required on each last lesson")
    .isISO8601()
    .withMessage(
      "Date for last lesson must be a valid date format as: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ",
    ),
  body("lastLesson.note").optional().isString().withMessage("Note must be a string"),
  body("lastLesson.plan").optional().isString().withMessage("Plan must be a string"),

  body("students")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Students must be a non-negative integer"),
];
export { create, updateOne, createLesson };

import { body } from "express-validator";

const create = [
  body("name").notEmpty().withMessage("Name is missing"),
  body("author").notEmpty().withMessage("Author is missing"),
  body("totalPages").isInt({ min: 1 }).withMessage("Total pages must be an integer greater than 0"),
  body("totalUnits").isInt({ min: 1 }).withMessage("Total units must be an integer greater than 0"),
  body("level")
    .isIn([
      "beginner",
      "pre-intermediate",
      "intermediate",
      "upper-intermediate",
      "advanced",
      "general",
    ])
    .withMessage(
      "Level must be one of these:" +
        "[beginner, pre-intermediate, intermediate, upper-intermediate, advanced, general]",
    ),
  body("edition")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Edition must be a non-negative integer"),
];

const updateOne = [
  body("name").optional().notEmpty().withMessage("Name is missing"),
  body("author").optional().notEmpty().withMessage("Author is missing"),
  body("totalPages")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total pages must be a non-negative integer"),
  body("totalUnits")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total units must be a non-negative integer"),
  body("level")
    .optional()
    .isIn([
      "beginner",
      "pre-intermediate",
      "intermediate",
      "upper-intermediate",
      "advanced",
      "general",
    ])
    .withMessage(
      "Level must be one of these:" +
        "[beginner, pre-intermediate, intermediate, upper-intermediate, advanced, general]",
    ),
  body("edition")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Edition must be a non-negative integer"),
];

export { create, updateOne };

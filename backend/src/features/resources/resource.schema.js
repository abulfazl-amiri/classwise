import * as z from "zod";
import mongoose from "mongoose";

const resourceIdSchema = z.object({
  id: z
    .string({
      error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
    })
    .refine(mongoose.isValidObjectId, { error: "Must be a valid ID" }),
});

const nameField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .min(1, { error: "This field is required" });

const authorField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .min(1, { error: "This field is required" });

const totalPagesField = z
  .number({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a number"),
  })
  .int({ error: "Must be an integer" })
  .min(1, { error: "Must be a positive integer" });

const totalUnitsField = z
  .number({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a number"),
  })
  .int({ error: "Must be an integer" })
  .min(1, { error: "Must be a positive integer" });

const levelField = z.enum(
  ["beginner", "pre-intermediate", "intermediate", "upper-intermediate", "advanced"],
  { error: "Invalid value" },
);

const editionField = z
  .number({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a number"),
  })
  .int({ error: "Must be an integer" })
  .min(0, { error: "Must be a non-negative integer" });

const createSchema = z.object({
  name: nameField,
  author: authorField,
  totalPages: totalPagesField,
  totalUnits: totalUnitsField,
  level: levelField,
  edition: editionField.optional(),
});

const updateSchema = z
  .object({
    name: nameField.optional(),
    author: authorField.optional(),
    totalPages: totalPagesField.optional(),
    totalUnits: totalUnitsField.optional(),
    level: levelField.optional(),
    edition: editionField.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided",
  });

export { createSchema, updateSchema, resourceIdSchema };

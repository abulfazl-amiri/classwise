import * as z from "zod";
import { OBJECT_ID_REGEX } from "../../../config/constants.js";

const resourceIdField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .regex(OBJECT_ID_REGEX, "Must be a valid ID");

const dateField = z.iso.datetime({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Invalid date"),
});

const pageField = z.int().min(0, { error: "Must be a non-negative integer" });

const unitField = z.int().min(0, { error: "Must be a non-negative integer" });

const noteField = z.string({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
});

const planField = z.string({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
});

/// schemas

const createSchema = z.object({
  resourceId: resourceIdField,
  date: dateField,
  page: pageField.optional(),
  unit: unitField.optional(),
  note: noteField.optional(),
  plan: planField.optional(),
});

const updateSchema = z.object({
  resourceId: resourceIdField.optional(),
  date: dateField.optional(),
  page: pageField.optional(),
  unit: unitField.optional(),
  note: noteField.optional(),
  plan: planField.optional(),
});

export { createSchema, updateSchema };

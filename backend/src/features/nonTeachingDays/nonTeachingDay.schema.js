import * as z from "zod";
import { OBJECT_ID_REGEX } from "../../config/constants.js";

const NON_TEACHING_DAY_REASONS = ["holiday", "cancellation"];

///

const dateField = z.iso.date({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Invalid date"),
});

//////// courseIds
const singleCourseId = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .regex(OBJECT_ID_REGEX, { error: "Must be a valid ID" });

const courseIdsField = z.array(singleCourseId, { error: "Must be an array" });

//////

const reasonField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .toLowerCase()
  .pipe(z.enum(NON_TEACHING_DAY_REASONS, { error: "Invalid value" }));

const noteField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim();

///

const createSchema = z.object({
  date: dateField,
  courseIds: courseIdsField.optional(),
  reason: reasonField,
  note: noteField.optional(),
});
const updateSchema = z.object({
  date: dateField.optional(),
  courseIds: courseIdsField.optional(),
  reason: reasonField.optional(),
  note: noteField.optional(),
});

export { createSchema, updateSchema };

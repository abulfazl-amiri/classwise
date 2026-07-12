import * as z from "zod";
import mongoose from "mongoose";

const resourceIdField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .refine(mongoose.isValidObjectId, {
    error: "Must be a valid ID",
  });

const teacherIdField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .refine(mongoose.isValidObjectId, {
    error: "Must be a valid ID",
  });

const roleField = z.literal("viewer", { error: "Invalid value" }).optional();

const grantSchema = z.object({
  teacherId: teacherIdField,
  role: roleField,
});

const resourceIdSchema = z.object({
  resourceId: resourceIdField,
});

const revokeParamsSchema = z.object({
  resourceId: resourceIdField,
  teacherId: teacherIdField,
});

export { grantSchema, resourceIdSchema, revokeParamsSchema };

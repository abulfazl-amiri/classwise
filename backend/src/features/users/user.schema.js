import * as z from "zod";
import { USER_ROLES } from "../../config/constants.js";

const emailField = z.email({
  error: (issue) =>
    issue.input === undefined ? "This field is required" : "Must be a valid email",
});

const roleField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .toLowerCase()
  .pipe(z.enum(USER_ROLES, { error: "Invalid role" }));

const passwordField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .min(8, { error: "Must be at least 8 characters" });

const nameField = z.string({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
});

const oldPasswordField = z.string({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
});

// === Schemas ===

const updateRoleSchema = z.object({
  role: roleField,
});

const changePasswordSchema = z.object({
  oldPassword: oldPasswordField,
  newPassword: passwordField,
});

const updateSchema = z.object({
  email: emailField.optional(),
  name: nameField.optional(),
});

export { updateRoleSchema, changePasswordSchema, updateSchema };

import * as z from "zod";
import { USER_ROLES } from "../../config/constants.js";

const updateRoleSchema = z.object({
  role: z
    .string({
      error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
    })
    .trim()
    .toLowerCase()
    .pipe(z.enum(USER_ROLES, { error: "Invalid value" })),
});

const changePasswordSchema = z.object({
  oldPassword: z.string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  }),
  newPassword: z
    .string({
      error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
    })
    .min(8, { error: "Must be at least 8 characters" }),
});

const updateSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? "This field is required" : "Must be a valid email",
  }),
  name: z.string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  }),
});

export { updateRoleSchema, changePasswordSchema, updateSchema };

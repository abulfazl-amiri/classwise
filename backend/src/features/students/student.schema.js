import * as z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const nameField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .toLowerCase();

const emailField = z
  .email({
    error: (issue) =>
      issue.input === undefined ? "This field is required" : "Must be a valid email",
  })
  .trim()
  .toLowerCase();

const phoneField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .refine((input) => isValidPhoneNumber(input), { error: "Must be a valid phone number" });

const createSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: emailField,
  phone: phoneField,
});

const updateSchema = z.object({
  firstName: nameField.optional(),
  lastName: nameField.optional(),
  email: emailField.optional(),
  phone: phoneField.optional(),
});

export { createSchema, updateSchema };

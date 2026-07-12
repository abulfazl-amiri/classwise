import * as z from "zod";

const emailField = z.email({
  error: (issue) =>
    issue.input === undefined ? "This field is required" : "Must be a valid email",
});

const passwordField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .min(8, { error: "Must be at least 8 characters" });

const resetTokenField = z.string({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
});

const signupSchema = z.object({
  email: emailField,
  password: passwordField,
});

const signinSchema = z.object({
  email: emailField,
  password: z.string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  }),
});

const forgotPasswordSchema = z.object({
  email: emailField,
});

const resetPasswordSchema = z.object({
  newPassword: passwordField,
  resetToken: resetTokenField,
});

const confirmPasswordSchema = z.object({
  password: z.string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  }),
});

export {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  confirmPasswordSchema,
};

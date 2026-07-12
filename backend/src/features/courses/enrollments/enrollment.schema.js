import * as constants from "../../../config/constants.js";
import * as z from "zod";

const studentField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .regex(constants.OBJECT_ID_REGEX, "Must be a valid ID");

const feeField = z
  .number({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a number"),
  })
  .min(0, "Must be a non-negative number");

const currencyCodeField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .toUpperCase()
  .pipe(
    z.enum(constants.ALLOWED_CURRENCY_CODES, {
      error: (issue) => (issue.input === undefined ? "This field is required" : "Invalid value"),
    }),
  );

const discountField = z
  .number({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a number"),
  })
  .min(0, "Must be a non-negative number")
  .max(100, "Must be a number between 0 and 100");

const startDateField = z.coerce.date({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Invalid date"),
});

const endDateField = z.coerce.date({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Invalid date"),
});

//

const createSchema = z.object({
  studentId: studentField,
  fee: feeField,
  currencyCode: currencyCodeField,
  discount: discountField.optional(),
  startDate: startDateField,
  endDate: endDateField,
});

const updateSchema = z.object({
  studentId: studentField.optional(),
  fee: feeField.optional(),
  currencyCode: currencyCodeField.optional(),
  discount: discountField.optional(),
  startDate: startDateField.optional(),
  endDate: endDateField.optional(),
});
export { createSchema, updateSchema };

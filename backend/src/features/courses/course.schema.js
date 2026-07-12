import { OBJECT_ID_REGEX, ALLOWED_CURRENCY_CODES } from "../../config/constants.js";

import * as z from "zod";

const nameField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .min(1, "This field is required");

const subjectField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .min(1, "This field is required");

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
  .pipe(z.enum(ALLOWED_CURRENCY_CODES, "Invalid value"));

const startDateField = z.coerce.date({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Invalid date"),
});

const endDateField = z.coerce.date({
  error: (issue) => (issue.input === undefined ? "This field is required" : "Invalid date"),
});

//////////// teachers

const singleTeacherId = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .regex(OBJECT_ID_REGEX, "Must be a valid ID");

const teachersField = z.array(singleTeacherId, {
  error: (issue) => (issue.input === undefined ? "This field is required" : "Must be an array"),
});

//////////// resources

const singleResourceId = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .regex(OBJECT_ID_REGEX, "Must be a valid ID");

const resourcesField = z.array(singleResourceId, {
  error: (issue) => (issue.input === undefined ? "This field is required" : "Must be an array"),
});

//////////// enrollments

const singleEnrollmentId = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .regex(OBJECT_ID_REGEX, "Must be a valid ID");

const enrollmentsField = z.array(singleEnrollmentId, {
  error: (issue) => (issue.input === undefined ? "This field is required" : "Must be an array"),
});

///////////

const scheduleIdField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .regex(OBJECT_ID_REGEX, "Must be a valid ID");

///////////////////////////

const createSchema = z.object({
  name: nameField,
  subject: subjectField,
  fee: feeField,
  currencyCode: currencyCodeField,
  startDate: startDateField,
  endDate: endDateField,

  teachers: teachersField.optional(),
  resources: resourcesField.optional(),
  enrollments: enrollmentsField.optional(),

  scheduleId: scheduleIdField.optional(),
});

const updateSchema = z.object({
  name: nameField.optional(),
  subject: subjectField.optional(),
  fee: feeField.optional(),
  currencyCode: currencyCodeField.optional(),
  startDate: startDateField.optional(),
  endDate: endDateField.optional(),

  teachers: teachersField.optional(),
  resources: resourcesField.optional(),
  enrollments: enrollmentsField.optional(),

  scheduleId: scheduleIdField.optional(),
});
export { createSchema, updateSchema };

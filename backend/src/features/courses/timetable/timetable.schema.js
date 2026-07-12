import * as z from "zod";

const topicField = z
  .string({
    error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
  })
  .trim()
  .min(1, { error: "This field is required" });

const dayField = z
  .object({
    topics: z
      .array(topicField, {
        error: (issue) =>
          issue.input === undefined ? "This field is required" : "Must be an array",
      })
      .optional(),
    startTime: z
      .int({ error: "Must be an integer" })
      .min(0, { error: "Must be between 0 and 1439" })
      .max(1439, { error: "Must be between 0 and 1439" })
      .optional(),
    endTime: z
      .int({ error: "Must be an integer" })
      .min(0, { error: "Must be between 0 and 1439" })
      .max(1439, { error: "Must be between 0 and 1439" })
      .optional(),
    isTeachingDay: z.boolean({ error: "Must be a boolean" }).optional(),
  })
  .refine(
    (data) => {
      if (data.isTeachingDay === false) return true;

      const { startTime, endTime } = data;
      if (startTime === undefined || endTime === undefined) {
        return false;
      }
      return startTime < endTime;
    },
    {
      error: "End time must be greater than start time on teaching days",
      path: ["endTime"],
    },
  );

const createSchema = z.object({
  monday: dayField,
  tuesday: dayField,
  wednesday: dayField,
  thursday: dayField,
  friday: dayField,
  saturday: dayField,
  sunday: dayField,
});

const updateSchema = z.object({
  monday: dayField.optional(),
  tuesday: dayField.optional(),
  wednesday: dayField.optional(),
  thursday: dayField.optional(),
  friday: dayField.optional(),
  saturday: dayField.optional(),
  sunday: dayField.optional(),
});

export { createSchema, updateSchema };

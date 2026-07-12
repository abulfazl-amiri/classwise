import * as z from "zod";
import { OBJECT_ID_REGEX } from "../../../config/constants.js";

const createSchema = z.object({
  recieverId: z
    .string({
      error: (issue) => (issue.input === undefined ? "This field is required" : "Must be a string"),
    })
    .regex(OBJECT_ID_REGEX, "Must be a valid ID"),
});

export { createSchema };

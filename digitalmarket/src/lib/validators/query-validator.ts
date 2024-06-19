import { z } from "zod";

// this is to make sure that the user can only filter by fields that we allow to prevent abuse of our api
export const QueryValidator = z.object({
  category: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.number().optional(),
});

// we can get typescript type.
export type TQueryValidator = z.infer<typeof QueryValidator>;

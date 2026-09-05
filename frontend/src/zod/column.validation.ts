import { z } from "zod";

export const createColumnSchema = z.object({
  title: z.enum(["TO_DO", "IN_PROGRESS", "IN_REVIEW", "DONE"], {
    error: "Please select a valid column title",
  }),
});
export type CreateColumnData = z.infer<typeof createColumnSchema>;

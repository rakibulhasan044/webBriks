import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assigneeIds: z.array(z.string()).optional(),
  selectedColumnId: z.string().min(1, "Column is required"),
});
export type CreateTaskData = z.infer<typeof createTaskSchema>;

export const editTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assigneeIds: z.array(z.string()).optional(),
  selectedColumnId: z.string().min(1, "Column is required"),
});
export type EditTaskData = z.infer<typeof editTaskSchema>;

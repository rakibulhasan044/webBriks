import { z } from "zod";

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title cannot exceed 50 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});
export type CreateBoardData = z.infer<typeof createBoardSchema>;

export const editBoardSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title cannot exceed 50 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});
export type EditBoardData = z.infer<typeof editBoardSchema>;

export const addMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
export type AddMemberData = z.infer<typeof addMemberSchema>;

import { IColumn } from "./column.types";
import { IUser } from "./user.type";
import { ITaskAttachment } from "./taskAttachment.types";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface ITask {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority | string;
  position: number;
  columnId: string;
  column?: IColumn;
  assignees?: IUser[];
  creatorId?: string | null;
  creator?: IUser | null;
  createdAt?: string;
  updatedAt?: string;
  attachments?: ITaskAttachment[];
}
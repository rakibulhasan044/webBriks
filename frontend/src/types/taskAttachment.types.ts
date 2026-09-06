import { ITask } from "./task.types";

export interface ITaskAttachment {
  id: string;
  filename: string;
  url: string;
  taskId: string;
  task?: ITask;
  createdAt: string;
}
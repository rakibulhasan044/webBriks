import { IBoard } from "./board.types";
import { ITask } from "./task.types";

export enum ColumnTitle {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export interface IColumn {
  id: string;
  title: ColumnTitle | string;
  position: number;
  boardId: string;
  board?: IBoard;
  createdAt?: string;
  updatedAt?: string;
  tasks?: ITask[];
}
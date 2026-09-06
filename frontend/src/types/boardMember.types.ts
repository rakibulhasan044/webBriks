import { IUser } from "./user.type";
import { IBoard } from "./board.types";

export enum BoardRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
}

export interface IBoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: BoardRole;
  createdAt: string;
  board?: IBoard;
  user?: IUser;
}
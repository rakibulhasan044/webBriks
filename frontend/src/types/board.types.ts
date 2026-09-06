import { IUser } from "./user.type";
import { IBoardMember } from "./boardMember.types";
import { IColumn } from "./column.types";

export interface IBoard {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  ownerId: string;
  owner?: IUser;
  createdAt: string;
  updatedAt: string;
  members?: IBoardMember[];
  columns?: IColumn[];
}
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";

export interface IBoard {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  ownerId: string;
  owner: {
    name: string;
    photo?: string;
  };
  members: any[];
  createdAt: string;
  updatedAt: string;
}

export const boardService = {
  getBoards: async (params?: any) => {
    return httpClient.getPaginated<IBoard>("/boards", { params });
  },

  getBoard: async (id: string) => {
    return httpClient.get<IBoard>(`/boards/${id}`);
  },

  createBoard: async (formData: FormData) => {
    return httpClient.post<IBoard>("/boards", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
};

import { httpClient } from "@/lib/axios/httpClient";

export const columnService = {
  createColumn: async (boardId: string, data: any) => {
    return httpClient.post(`/boards/${boardId}/columns`, data);
  },
  
  updateColumn: async (columnId: string, data: any) => {
    return httpClient.patch(`/columns/${columnId}`, data);
  },
  
  deleteColumn: async (columnId: string) => {
    return httpClient.delete(`/columns/${columnId}`);
  }
};

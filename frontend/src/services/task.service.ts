import { ITask } from "@/types/task.types";
import { ApiResponse } from "@/types/api.types";
import { httpClient } from "@/lib/axios/httpClient";

export const taskService = {
  createTask: async (columnId: string, data: any): Promise<ApiResponse<ITask>> => {
    return httpClient.post(`/columns/${columnId}/tasks`, data);
  },
  
  updateTask: async (taskId: string, data: any) => {
    return httpClient.patch(`/tasks/${taskId}`, data);
  },
  
  deleteTask: async (taskId: string) => {
    return httpClient.delete(`/tasks/${taskId}`);
  },

  addAttachment: async (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteAttachment: async (taskId: string, attachmentId: string) => {
    return httpClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  }
};

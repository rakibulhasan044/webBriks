import { httpClient } from "@/lib/axios/httpClient";
import { IUser } from "@/types/user.type";

export const userService = {
  updateProfile: async (data: { name: string; photo?: File | null }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.photo) {
      formData.append("photo", data.photo);
    }
    
    // We use the raw axios instance or just use httpPatch with multipart/form-data
    // Since httpPatch sends JSON by default if we don't change headers, we should do it properly.
    return httpClient.patch<IUser>("/auth/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  changePassword: async (data: any) => {
    return httpClient.patch("/auth/change-password", data);
  }
};

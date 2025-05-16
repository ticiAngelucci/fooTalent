import axios from "axios";
import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";



export const updateContract = async (id: number, formData: FormData) => {
  try {
    const token = useUserStore.getState().token;
    const response = await axios.put(`${API_URL}/contracts/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
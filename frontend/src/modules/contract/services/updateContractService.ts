import axios from "axios";
import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";



export const updateContract = async (id: number, formData: FormData) => {
    const token = useUserStore.getState().token;

  return axios.put(`${API_URL}/contracts/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

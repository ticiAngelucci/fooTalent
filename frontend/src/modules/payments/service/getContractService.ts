import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import axios from "axios";

export const getContractById = async (id: number) => {
  const token = useUserStore.getState().token;
  const isAuthenticated = useUserStore.getState().isAuthenticated;
  if (!token && !isAuthenticated)
    throw Object.assign(new Error("No autorizado"), { status: 401 });
  const response = await axios.get(`${API_URL}/contracts/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`,
      }
  });
  return response.data;
};

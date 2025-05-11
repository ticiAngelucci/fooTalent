import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { PropertyFormData } from "../schemas/property.schema";

export const createProperty = async (data: PropertyFormData) => {
  try {
    const token = useUserStore.getState().token;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (!token && !isAuthenticated)
      throw Object.assign(new Error("No autorizado"), { status: 401 });
    const response = await axios.post(`${API_URL}/properties/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const editProperty = async (id: string, data: PropertyFormData) => {
  try {
    const token = useUserStore.getState().token;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (!token && !isAuthenticated)
      throw Object.assign(new Error("No autorizado"), { status: 401 });
    const response = await axios.patch(
      `${API_URL}/properties/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const deleteProperty = async (id: string) => {
    const token = useUserStore.getState().token;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (!token && !isAuthenticated)
      throw Object.assign(new Error("No autorizado"), { status: 401 });
    const response = await axios.delete(`${API_URL}/properties/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;

};

export const getOwnerList = async () => {
  try {
    const token = useUserStore.getState().token;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (!token && !isAuthenticated)
      throw Object.assign(new Error("No autorizado"), { status: 401 });
    const response = await axios.get(`${API_URL}/owner`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.content;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

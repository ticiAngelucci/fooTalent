import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { PaymentFormData } from "../schemas/payment.schema";

export const createPayment = async (data: PaymentFormData) => {
  try {
    const token = useUserStore.getState().token;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (!token && !isAuthenticated)
      throw Object.assign(new Error("No autorizado"), { status: 401 });
    const response = await axios.post(`${API_URL}/payments`, data, {
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

export const deletePayment = async (id: string) => {
  try {
    const token = useUserStore.getState().token;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (!token && !isAuthenticated)
      throw Object.assign(new Error("No autorizado"), { status: 401 });
    const response = await axios.delete(
      `${API_URL}/payments/${id}`,
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

export const payRent = async(paymentId: number, data : PaymentFormData)=> {
  try {
    const token = useUserStore.getState().token;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (!token && !isAuthenticated)
      throw Object.assign(new Error("No autorizado"), { status: 401 });
    const response = await axios.put(`${API_URL}/payments/${paymentId}`, data, {
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
}
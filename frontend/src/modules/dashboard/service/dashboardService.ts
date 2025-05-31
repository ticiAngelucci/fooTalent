import axios from "axios";
import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import { Contract } from "@/modules/contract/types/contract";
import { Payment } from "../store/paymentsStore";
import { Property } from "../types/property.types";
import { Tenant } from "../types/tentant.types";

export const getPayments = async (): Promise<Payment[]> => {
  const token = useUserStore.getState().token;
  const isAuthenticated = useUserStore.getState().isAuthenticated;
  if (!token && !isAuthenticated)
    throw Object.assign(new Error("No autorizado"), { status: 401 });
  const response = await axios.get(`${API_URL}/payments/all-details?page=0&size=40`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.dto;
};

export const getContracts = async (): Promise<Contract[]> => {
  const token = useUserStore.getState().token;
  const isAuthenticated = useUserStore.getState().isAuthenticated;
  if (!token && !isAuthenticated)
    throw Object.assign(new Error("No autorizado"), { status: 401 });

  const response = await axios.get(`${API_URL}/contracts?page=0&size=3`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.content;
};

export const getProperties = async (): Promise<Property[]> => {
  const token = useUserStore.getState().token;
  const isAuthenticated = useUserStore.getState().isAuthenticated;
  if (!token && !isAuthenticated)
    throw Object.assign(new Error("No autorizado"), { status: 401 });
  try {
    const response = await axios.get(`${API_URL}/properties/all`, {
      params: {
        page: 0,
        size: 3,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const content = response.data?.content;

    if (!Array.isArray(content)) {
      throw new Error("Respuesta inválida del servidor");
    }

    return content;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getTenants = async (): Promise<Tenant[]> => {
  const token = useUserStore.getState().token;
  const isAuthenticated = useUserStore.getState().isAuthenticated;
  if (!token && !isAuthenticated)
    throw Object.assign(new Error("No autorizado"), { status: 401 });
  try {
    const response = await axios.get(`${API_URL}/tenants?page=0&size=3`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data?.dto;

    if (!Array.isArray(data)) {
      throw new Error("Respuesta inválida del servidor");
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

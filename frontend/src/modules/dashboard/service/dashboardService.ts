import axios from "axios";
import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import { Contract } from "@/modules/contract/types/contract";
import { Payment } from "../store/paymentsStore";
import { Property } from "../types/property.types";
import { Tenant } from "../types/tentant.types";

const token = useUserStore.getState().token;

export const getPayments = async (): Promise<Payment[]> => {
  const response = await axios.get(`${API_URL}/payments/all-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.dto;
};

export const getContracts = async (): Promise<Contract[]> => {
  const token = useUserStore.getState().token;

  const response = await axios.get(`${API_URL}/contracts?page=0&size=3`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.content;
};

export const getProperties = async (): Promise<Property[]> => {
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
    console.error("Error al obtener propiedades", error);
    throw error;
  }
};



export const getTenants = async (): Promise<Tenant[]> => {
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
    console.error("Error al obtener inquilinos", error);
    throw error;
  }
};

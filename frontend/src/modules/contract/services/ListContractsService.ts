import axios from "axios";
import { defaultPageSize, Contract } from "../types/contract";
import { API_URL } from "@/shared/constants/api";

interface ContractsResponse {
  content: Contract[];
  totalPages: number;
  totalElements: number;
  
}

export async function fetchAllContracts(page: number = 0, size: number = defaultPageSize): Promise<ContractsResponse> {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const response = await axios.get(`${API_URL}/contracts`, {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    
    console.log("response.data", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error al obtener contratos:", error);
    throw error;
  }
}
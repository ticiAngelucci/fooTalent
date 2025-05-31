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
    const token = localStorage.getItem('token');

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
        
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
}
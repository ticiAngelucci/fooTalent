import axios from "axios";
import { defaultPageSize, Property } from "../types/property";
const API_URL = import.meta.env.VITE_API_URL;

interface PropertiesResponse {
  content: Property[];
  totalPages: number;
  totalElements: number;
  
}

export async function fetchAllProperties(page: number = 0, size: number = defaultPageSize): Promise<PropertiesResponse> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const response = await axios.get(`${API_URL}/properties/all?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;

}
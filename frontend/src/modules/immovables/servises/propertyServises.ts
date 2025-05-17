import axios from "axios";
import { defaultPageSize, Property } from "../types/property";
const API_URL = import.meta.env.VITE_API_URL;

interface PropertiesResponse {
  content: Property[];
  totalPages: number;
  totalElements: number;
  
}

export async function fetchAllProperties(page: number = 0, size: number = defaultPageSize): Promise<PropertiesResponse> {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const response = await axios.get(`${API_URL}/properties/all?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    throw error;
  }
}

// Aquí se  agrega las otras funciones como:
// export async function createProperty(propertyData: Omit<Property, 'id_property'>): Promise<Property> { ... }
// export async function updateProperty(id: number, propertyData: Partial<Property>): Promise<Property> { ... }
// export async function deleteProperty(id: number): Promise<void> { ... }
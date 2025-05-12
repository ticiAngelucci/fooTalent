import axios from "axios";
import { Property } from "../types/property";

const API_URL = "https://rentaryy.koyeb.app";

export async function fetchAllProperties(): Promise<Property[]> {
  try {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const response = await axios.get(`${API_URL}/properties/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    throw error;
  }
}

// Aquí se  agrega las otras funciones como:
// export async function createProperty(propertyData: Omit<Property, 'id_property'>): Promise<Property> { ... }
// export async function updateProperty(id: number, propertyData: Partial<Property>): Promise<Property> { ... }
// export async function deleteProperty(id: number): Promise<void> { ... }
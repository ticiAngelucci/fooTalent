import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { Tenant } from "../schemas/tenantSchema";

export const createTenant = async (data: Tenant) => {
  const {
    firstName,
    lastName,
    dni,
    phone,
    email,
    street,
    number,
    locality,
    warranty,
    country,
    province,
    postalCode,
    files = [],
  } = data;

  const dataEnviar = {
    firstName: firstName,
    lastName: lastName,
    dni: dni,
    phone: phone,
    warranty: warranty,
    email: email,
    address: {
      country: country,
      province: province,
      locality: locality,
      street: street,
      number: number?.toString(),
      postalCode: postalCode,
    },
  };

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append(
    "tenant",
    new Blob([JSON.stringify(dataEnviar)], { type: "application/json" })
  );
  
  files.forEach((file: File) => {
    formData.append("documents", file);
  });
  try {
    const response = await axios.post(`${API_URL}/tenants`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al crear el inquilino:", error);
    throw error;
  }
};

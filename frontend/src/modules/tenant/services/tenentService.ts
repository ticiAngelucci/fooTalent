import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { Tenant } from "../types/tenant";
import { useUserStore } from "@/store/userStore";

export const createTenant = async (data: Tenant) => {
  const {
    firstName,
    lastName,
    dni,
    phone,
    email,
    street,
    number,
    city,
    province,
    postalCode,
    files = [],
  } = data;

  const token = useUserStore.getState().token;
  const formData = new FormData();
  console.log(token)
   formData.append("firstName", firstName || "");
  formData.append("lastName", lastName || "");   
  formData.append("dni", dni || "");               
  formData.append("phone", phone || "");         
  formData.append("email", email || "");           
  formData.append("street", street || "");        
  formData.append("number", number?.toString() || ""); 
  formData.append("city", city || "");             
  formData.append("province", province || "");   
  formData.append("postalCode", postalCode || ""); 

  files.forEach((file) => {
    formData.append("documents[]", file);
  });
  console.log(formData)
  try {
    const response = await axios.post(`${API_URL}/tenants`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al crear el inquilino:", error);
    throw error;
  }


};

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
  console.log("file",files)
 const base64Files = await Promise.all(
    files.map((file) => fileToBase64(file)) 
  );

  const tenant = {
    name: firstName,
    lastName,
    dni,
    phone,
    email,
    address: {
      country: "",
      province,
      locality: city,
      street,
      number,
      postalCode,
    },
  };

  const payload = {
    tenant,
    documents: base64Files,
  };
  
  const response = await axios.post(`${API_URL}/tenants`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log("base",base64)
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

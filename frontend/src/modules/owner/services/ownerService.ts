import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { Owner } from "../types/owner";
import { useUserStore } from "@/store/userStore";

export const createOwner = async (data: Owner) => {
  const {
    firstName,
    lastName,
    dni,
    phone,
    email,
    street,
    number,
    locality,
    province,
    postalCode,
    file,
  } = data;

  const token = useUserStore.getState().token;

  let base64File = "";
  if (file instanceof File) {
    base64File = await fileToBase64(file);
  }

  const payload = {
    firstName,
    lastName,
    dni,
    phone,
    email,
    address: {
      country: "",
      province,
      locality,
      street,
      number,
      postalCode,
    },
    attachedDocument: base64File,
  };

  const response = await axios.post(`${API_URL}/owner/create`, payload, {
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
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

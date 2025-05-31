import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { useUserStore } from "@/store/userStore";


const token = useUserStore.getState().token;

const headers = {
  Authorization: `Bearer ${token}`,
};


export const createContract = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/contracts`, formData, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data; 
    }
    throw error; 
  }
};


export async function fetchTenants() {
  const response = await axios.get(`${API_URL}/tenants`, { headers });
  return response.data;
}

export async function fetchOwners() {
  const response = await axios.get(`${API_URL}/owner`, { headers });
  
  return response.data;
}

export async function fetchProperties(id: string) {
  const response = await axios.get(`${API_URL}/owner/${id}/available-properties`, { headers });
  return response.data;
}


import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { useUserStore } from "@/store/userStore";


const token = useUserStore.getState().token;

const headers = {
  Authorization: `Bearer ${token}`,
};


export const createContract = async (formData: FormData) => {
  return axios.post(`${API_URL}/contracts`, formData, {headers} );
};


export async function fetchTenants() {
  const response = await axios.get(`${API_URL}/tenants`, { headers });
  return response.data;
}

export async function fetchOwners() {
  const response = await axios.get(`${API_URL}/owner`, { headers });
  console.log(response.data);
  
  return response.data;
}

export async function fetchProperties() {
  const response = await axios.get(`${API_URL}/properties/all`, { headers });
  return response.data;
}


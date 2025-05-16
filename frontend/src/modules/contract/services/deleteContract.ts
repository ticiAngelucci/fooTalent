import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import axios from "axios";

const token = useUserStore.getState().token;

const headers = {
  Authorization: `Bearer ${token}`,
};


export async function deleteContract(id: number) {
  return axios.delete(`${API_URL}/contracts/${id}`, {headers})
};
  
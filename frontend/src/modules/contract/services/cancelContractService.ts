import { API_URL } from "@/shared/constants/api";
import axios from "axios";

const token = localStorage.getItem("token");

export const cancelContract = async (id: number) => {
  try {
    const response = await axios.put(
      `${API_URL}/contracts/${id}/finalize`, 
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

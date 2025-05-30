import axios from "axios"
import { getAuthToken } from "../store/authStore"
import { ApiResponse } from "../types/pyments"
import { API_URL } from "@/shared/constants/api";

export const fetchPayments = async (currentPage: number, pageSize: number): Promise<ApiResponse> => {
  try {
    const token = getAuthToken()
    const response = await axios.get<ApiResponse>(
      `${API_URL}/payments/all-rent?page=${currentPage}&size=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data; 
    }
    throw error
  }
}

export const formatDeadline = (deadline: number): string => {   
  return `${deadline} / mes`
}
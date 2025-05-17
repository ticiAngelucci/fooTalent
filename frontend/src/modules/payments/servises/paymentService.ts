import axios from "axios"
import { getAuthToken } from "../store/authStore"
import { ApiResponse } from "../types/pyments"


export const fetchPayments = async (currentPage: number, pageSize: number): Promise<ApiResponse> => {
  try {
    const token = getAuthToken()
    const response = await axios.get<ApiResponse>(
      `https://rrentary.koyeb.app/payments/all-details?page=${currentPage}&size=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    return response.data
  } catch (error) {
    console.error("Error al cargar los pagos:", error)
    throw error
  }
}

export const formatDeadline = (deadline: number): string => {   
  return `${deadline} / mes`
}
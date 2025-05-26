import { ApiResponse } from "../types/paymentsContract";
import { API_URL } from "@/shared/constants/api";

export const fetchContractPayments = async (contractId: number): Promise<ApiResponse> => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error("No se encontró token de autenticación");
  }

  const response = await fetch(
    `${API_URL}/payments/contract/${contractId}?page=0&size=10`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
};
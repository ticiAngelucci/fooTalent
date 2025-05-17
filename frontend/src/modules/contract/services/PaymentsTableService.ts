import { ApiResponse } from "../types/paymentsContract";

export const fetchContractPayments = async (contractId: number): Promise<ApiResponse> => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error("No se encontró token de autenticación");
  }

  const response = await fetch(
    `https://rrentary.koyeb.app/payments/contract/${contractId}?page=0&size=10`,
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
import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { LoginFormValues } from "../schemas/login.schemas";

interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const userRegister = async (userData: UserProps) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un error";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    throw new Error(errorMessage);
  }
};

export const userLogin = async (userData: LoginFormValues) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un error al Iniciar sesión";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

import { API_URL } from "@/shared/constants/api";
import axios from "axios";

interface UserProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const userRegister = async (userData: UserProps) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    // Puedes capturar y lanzar un mensaje más limpio aquí
    const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al Registrarse";
    throw new Error(errorMessage);
  }
};

export const userLogin = async (userData: Omit<UserProps, "username" |"confirmPassword">) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, userData);
    return response.data;
    
  } catch (error: any) {
    // Puedes capturar y lanzar un mensaje más limpio aquí
    const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al Iniciar sesión";
    throw new Error(errorMessage);
  }
};

interface ResetPasswordProps {
  password: string;
  confirmPassword: string;
}

export const resetPassword = async (data: ResetPasswordProps, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/reset-password`, 
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al restablecer la contraseña";
    throw new Error(errorMessage);
  }
};

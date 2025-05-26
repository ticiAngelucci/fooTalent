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

interface ResetPasswordProps {
  password: string;
  confirmPassword: string;
}

export const resetPassword = async (data: ResetPasswordProps, token: string) => {
  try {
    const newData = {token,
      newPassword: data.password,
      confirmPassword: data.confirmPassword
    };
    const response = await axios.put(
      `${API_URL}/auth/reset_password`, 
      newData
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al restablecer la contraseña";
    throw new Error(errorMessage);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot_password`, { email });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un error al enviar el correo";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const sendEmailConfirmation = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/send-email-confirmation`, { email });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un error al enviar el correo de confirmación";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}

export const getUserInfo = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_URL}/users/me`,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un error al obtener credenciales de usuario";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}

import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { useUserStore } from "@/store/userStore";

interface UserProps {
  newPassword: string;
  oldPassword: string;
}

export const changePassword = async (userData: UserProps) => {
  try {
    const username = useUserStore.getState().username;
    if (!username) {
      throw new Error("El usuario no está autenticado.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = { email: username, ...userData };
    console.log("Datos enviados:", data);
    const response = await axios.put(`${API_URL}/auth/change_password`, data);
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
export const getUser = async (token: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un error al obtener tus datos";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
export const setUser = async (data: string | null) => {
  const token = useUserStore.getState().token;
  try {
    const response = await axios.put(`${API_URL}/users/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un error al cambiar tus datos";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
export const uploadImage = async (file: File) => {
  const token = useUserStore.getState().token;
  const formData = new FormData();
  formData.append("image", file); // La clave debe coincidir con la esperada por el backend

  try {
    const response = await axios.post(
      `${API_URL}/users/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un error al subir la imagen";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

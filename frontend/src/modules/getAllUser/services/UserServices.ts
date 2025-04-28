import axios from "axios";
import { UserFormValues } from "../schemas/userSchema";

export const userCreate =  async(data: any) =>{
    try {
        const response = await axios.post(`https://alura-geek-api-kohl.vercel.app/users`,data);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al Registrarse";
        throw new Error(errorMessage);
    }
}

export const userEdit = async (id: number, data: UserFormValues) => {
    try {
      const response = await axios.put(`https://alura-geek-api-kohl.vercel.app/users/${id}`, data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al actualizar";
      throw new Error(errorMessage);
    }
  };

export const userDelete =  async(id: number) =>{
    try {
        const response = await axios.delete(`https://alura-geek-api-kohl.vercel.app/users/${id}`);
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al Registrarse";
        throw new Error(errorMessage);     
    }
}
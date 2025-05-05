import { API_URL } from "@/shared/constants/api"
import axios from "axios";

export const getAllUsers = async()=>{
    try {
        const response = await axios.get(`https://alura-geek-api-kohl.vercel.app/users`);
        return response.data;
    } catch (error) {
        console.error('Ocurrio un error papi', error);
    }
}
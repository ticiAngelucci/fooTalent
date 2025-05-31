import axios from "axios"
import { API_URL } from "@/shared/constants/api";
import type { ContactFormData } from "../components/ContactSection"

export const sendContactForm = async (data: ContactFormData) => {
  const response = await axios.post(`${API_URL}/sendEmailLanding`, data)
  return response.data
}

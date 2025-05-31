import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { adaptOwnerToPayload } from "../adapter/ownerAdapter";

const token = useUserStore.getState().token;

export const createOwner = async (
  data: ReturnType<typeof adaptOwnerToPayload>
) => {
  const { attachedDocument } = data;
  const { attachedDocument: _, ...ownerWithoutFile } = data;

  const formData = new FormData();

  formData.append(
    "owner",
    new Blob([JSON.stringify(ownerWithoutFile)], { type: "application/json" })
  );

  attachedDocument.forEach((file: File) => {
    formData.append("documents", file);
  });

  const response = await axios.post(`${API_URL}/owner`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchOwner = async (id: any) => {
  try {
    const response = await axios.get(`${API_URL}/owner/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data; 
    }
  }
};

export const deleteOwner = async (ownerId: number) => {
     await axios.delete(`${API_URL}/owner/delete/${ownerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

};

export const EditOwner = async (
  data: ReturnType<typeof adaptOwnerToPayload>, id: number
) => {

  const { attachedDocument } = data;
  const { attachedDocument: _, ...ownerWithoutFile } = data;

  const formData = new FormData();

  formData.append(
    "owner",
    new Blob([JSON.stringify(ownerWithoutFile)], { type: "application/json" })
  );

  attachedDocument.forEach((file: File) => {
    formData.append("documents", file);
  });

  const response = await axios.put(`${API_URL}/owner/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

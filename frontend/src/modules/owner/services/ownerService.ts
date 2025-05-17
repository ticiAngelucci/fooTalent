import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { adaptOwnerToPayload } from "../adapter/ownerAdapter";

const token = useUserStore.getState().token;

export const createOwner = async (
  data: ReturnType<typeof adaptOwnerToPayload>
) => {
  console.log(data);

  const { attachedDocument } = data;
  const { attachedDocument: _, ...ownerWithoutFile } = data;

  const formData = new FormData();

  // Agregar el objeto owner sin el documento
  formData.append(
    "owner",
    new Blob([JSON.stringify(ownerWithoutFile)], { type: "application/json" })
  );

  // Agregar el documento si existe
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
    console.error("Error fetching owner:", error);
  }
};

export const deleteOwner = async (ownerId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/owner/delete/${ownerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response.data);
  } catch (err) {
    console.error(err);
  }
};

export const EditOwner = async (
  data: ReturnType<typeof adaptOwnerToPayload>, id: number
) => {
  console.log(data);

  const { attachedDocument } = data;
  const { attachedDocument: _, ...ownerWithoutFile } = data;

  const formData = new FormData();

  // Agregar el objeto owner sin el documento
  formData.append(
    "owner",
    new Blob([JSON.stringify(ownerWithoutFile)], { type: "application/json" })
  );

  // Agregar el documento si existe
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

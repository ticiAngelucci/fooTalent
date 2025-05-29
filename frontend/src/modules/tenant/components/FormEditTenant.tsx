import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tenant, tenantSchema } from "../schemas/tenantSchema";
import { FormProvider } from "react-hook-form";
import PersonalDataFields from "./PersonalDataFields";
import AddressFields from "./AddressFields";
import DocumentUpload from "./DocumentUpload";
import FormEditFooter from "./FormEditFooter";
import { API_URL } from "@/shared/constants/api";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Check, CircleAlert } from "lucide-react";
import { DocumentFromAPI } from "@/shared/interfaces/documentInterface";

type EditTenantProps = {
  initialData: Tenant;
  documents?: DocumentFromAPI[];
};

const EditTenant = ({ initialData, documents }: EditTenantProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const tenantId = Number(id);
  const { token } = useUserStore();
  const navigate = useNavigate();

  const handleDelete = async (tenantId: number) => {
    try {
      setIsDeleting(true);
      await axios.delete(`${API_URL}/tenants/${tenantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/contact");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        throw err.response.data;
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const methods = useForm<Tenant>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData,
  });

  const { reset } = methods;

  const onSubmit = async (data: Tenant) => {
    if (!id) return;
    const dataEnviar = {
      firstName: data.firstName,
      lastName: data.lastName,
      dni: data.dni,
      email: data.email,
      phone: data.phone,
      warranty: data.warranty,
      address: {
        country: data.country,
        province: data.province || "",
        locality: data.locality || "",
        street: data.street || "",
        number: data.number?.toString() || "",
        postalCode: data.postalCode || "",
      },
    };

    const formData = new FormData();
    formData.append(
      "tenant",
      new Blob([JSON.stringify(dataEnviar)], { type: "application/json" })
    );
    data.files?.forEach((file: File) => {
      formData.append("documents", file);
    });
    try {
      const response = await axios.put(`${API_URL}/tenants/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.custom(
        () => (
          <div className="bg-green-50 border border-green-600/20 rounded-md p-4 w-[360px] shadow-md">
            <p className="text-green-700 font-semibold text-sm flex gap-2 items-center">
              <Check />
              ¡Cambios realizados con éxito!
            </p>
            <p className="text-gray-700 text-sm mt-1">
              Los datos del inquilino se han actualizado correctamente.
            </p>
          </div>
        ),
        {
          duration: 5000,
        }
      );
      setIsEditing(false);
      navigate("/contact");
    } catch {
      toast.custom(
        () => (
          <div className="bg-error-50 border border-error-600/70 rounded-md p-4 w-[360px] shadow-md">
            <p className="text-error-700 font-semibold text-sm flex gap-2 items-center">
              <CircleAlert />
              ¡Ha ocurrido un error!
            </p>
            <p className="text-gray-700 text-sm mt-1">
              Los datos no se han podido actualizar, intente nuevamente.
            </p>
          </div>
        ),
        {
          duration: 5000,
        }
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalDataFields disabled={!isEditing} disableDni={true} />
          <DocumentUpload documents={documents} />
        </div>

        <AddressFields disabled={!isEditing} />

        <FormEditFooter
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={() => {
            reset(initialData);
            setIsEditing(false);
          }}
          isDeleting={isDeleting}
          onDelete={() => {
            if (tenantId) {
              handleDelete(tenantId);
            }
          }}
        />
      </form>
    </FormProvider>
  );
};

export default EditTenant;

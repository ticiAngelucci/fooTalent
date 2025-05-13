import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ownerSchema } from "../schemas/ownerSchema";
import { Owner } from "../types/owner";
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

const FormEditOwner = ({ initialData }: { initialData: Owner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const ownerId = Number(id);
  const { token } = useUserStore();
  const navigate = useNavigate();

  const handleDelete = async (ownerId: number) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${API_URL}/owner/delete/${ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response.data);
      navigate("/contact");
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const methods = useForm<Owner>({
    resolver: zodResolver(ownerSchema),
    defaultValues: initialData,
  });

  const { reset } = methods;

  const onSubmit = async (data: Owner) => {
    if (!id) return;
  
    try {
      const response = await axios.put(
        `${API_URL}/owner/update/${id}`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          dni: data.dni,
          email: data.email,
          phone: data.phone,
          address: {
            country: "", 
            province: data.province || "",
            locality: data.locality || "",
            street: data.street || "",
            number: data.number || "",
            postalCode: data.postalCode || "",
          },
          attachedDocument: "", 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.custom(
        () => (
          <div className="bg-green-50 border border-green-600/20 rounded-md p-4 w-[360px] shadow-md">
            <p className="text-green-700 font-semibold text-sm flex gap-2 items-center">
               <Check/>¡Cambios realizados con éxito!
            </p>
            <p className="text-gray-700 text-sm mt-1">
              Los datos del propietario se han actualizado correctamente.
            </p>
          </div>
        ),
        {
          duration: 5000,
        },
      );
      console.log("Actualizado:", response.data);
      setIsEditing(false);
      navigate("/contact");
  
    } catch {
        toast.custom(
            () => (
              <div className="bg-error-50 border border-error-600/70 rounded-md p-4 w-[360px] shadow-md">
                <p className="text-error-700 font-semibold text-sm flex gap-2 items-center">
                    <CircleAlert/>¡Ha ocurrido un error!
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
          <DocumentUpload />
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
            if (ownerId) {
              handleDelete(ownerId);
            }
          }}
        />
      </form>
    </FormProvider>
  );
};

export default FormEditOwner;

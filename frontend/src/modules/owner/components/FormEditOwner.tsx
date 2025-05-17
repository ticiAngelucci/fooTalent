import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";
import PersonalDataFields from "./PersonalDataFields";
import AddressFields from "./AddressFields";
import DocumentUpload from "./DocumentUpload";
import FormEditFooter from "./FormEditFooter";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { OwnerFromAPI } from "../types/ownerFromApi";
import { deleteOwner, EditOwner } from "../services/ownerService";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { Owner, ownerSchema } from "../schemas/ownerSchema";
import { adaptOwnerToPayload } from "../adapter/ownerAdapter";

interface Props {
  initialData: OwnerFromAPI
}

const FormEditOwner = ({ initialData }:  Props ) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {documents} = initialData;


  const { id } = useParams();
  const ownerId = Number(id);
  const navigate = useNavigate();

  const handleDelete = async (ownerId: number) => {
    try {
      setIsDeleting(true);
      await deleteOwner(ownerId);
      navigate("/contact");
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const methods = useForm<Owner>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      dni: initialData.dni,
      phone: initialData.phone,
      email: initialData.email,
      street: initialData.address.street,
      number: initialData.address.number,
      locality: initialData.address.locality,
      country: initialData.address.country,
      province: initialData.address.province,
      postalCode: initialData.address.postalCode,
      attachedDocument: [],
    }
  });

  const { reset } = methods;

  const onSubmit = async (data: Owner) => {
    if (!id) return;

    try {
      const finalData = adaptOwnerToPayload({...data});
      await EditOwner(finalData, Number(id));
      toast.custom(
        () => (
          <SuccessToast title="¡Cambios realizados con éxito!" description="Los datos del propietario se han actualizado correctamente." />   
        ),
        {
          duration: 5000,
        },
      );
      setIsEditing(false);
      navigate("/contact");
    } catch {
      toast.custom(
        () => (
          <ErrorToast title="¡Ha ocurrido un error!" description="Los datos no se han podido actualizar, intente nuevamente." />
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

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tenantSchema, Tenant } from "../schemas/tenantSchema"
import { useNavigate } from "react-router-dom";

import PersonalDataFields from "./PersonalDataFields";
import AddressFields from "./AddressFields";
import DocumentUpload from "./DocumentUpload";
import FormFooter from "./FormFooter";
import { createTenant } from "../services/tenentService"
import { toast } from "sonner";

import { CircleAlert } from 'lucide-react';
import { Check } from 'lucide-react';
import { AxiosError } from "axios";

const FormAddTenant = () => {

    const navigate = useNavigate();

  const methods = useForm<Tenant>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      phone: "",
      email: "",
      street: "",
      locality:"",
      number: "",
      province: "",
      postalCode: "",
      files: [],
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      await createTenant({ ...data });
      toast.custom(
        () => (
          <div className="bg-green-50 border border-green-600/20 rounded-md p-4 w-[360px] shadow-md">
            <p className="text-green-700 font-semibold text-sm flex gap-2 items-center">
               <Check/>¡Inquilino creado con éxito!
            </p>
            <p className="text-gray-700 text-sm mt-1">
              El inquilino ha sido registrado y ahora está disponible en el
              sistema para su gestión.
            </p>
          </div>
        ),
        {
          duration: 5000,
        },
      );
      navigate("/contact")

    }  catch(error: unknown) {
      const err = error as AxiosError<{ errorCode: string; errorMessage: string; details: string[] }>;
    
      const isConflict = err.response?.status === 409;
      const detailMessage = err.response?.data?.details?.[0] || "Ya existe un inquilino con ese DNI.";
    
      toast.custom(
        () => (
          <div className="bg-error-50 border border-error-600/70 rounded-md p-4 w-[360px] shadow-md">
            <p className="text-error-700 font-semibold text-sm flex gap-2 items-center">
              <CircleAlert />
              ¡Ha ocurrido un error!
            </p>
            <p className="text-gray-700 text-sm mt-1">
              {isConflict
                ? `No se pudo registrar el inquilino. ${detailMessage}`
                : "El inquilino no se pudo añadir al sistema, intente nuevamente."
              }
            </p>
          </div>
        ),
        { duration: 5000 }
          );
        }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PersonalDataFields />
          </div>
          <div>
            <DocumentUpload />
          </div>
        </div>

        <div className="pt-2">
          <h4 className="text-md font-semibold mb-2">Dirección</h4>
          <AddressFields />
        </div>

        <FormFooter />
      </form>
    </FormProvider>
  );
};

export default FormAddTenant;

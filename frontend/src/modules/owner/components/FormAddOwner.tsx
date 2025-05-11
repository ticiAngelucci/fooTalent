import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ownerSchema, Owner } from "../schemas/ownerSchema";

import PersonalDataFields from "./PersonalDataFields";
import AddressFields from "./AddressFields";
import DocumentUpload from "./DocumentUpload";
import FormFooter from "./FormFooter";
import { createOwner } from "../services/ownerService";

const FormAddOwner = () => {
  const methods = useForm<Owner>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      phone: "",
      email: "",
      street: "",
      number: "",
      city: "",
      province: "",
      postalCode: "",
      file: undefined,
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      await createOwner(data);
      console.log("✅ Propietario creado exitosamente");
    } catch (error) {
      console.error("❌ Error al enviar el formulario:", error);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Datos + Documentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PersonalDataFields />
          </div>
          <div>
            <DocumentUpload />
          </div>
        </div>

        {/* Dirección */}
        <div className="pt-2">
          <h4 className="text-md font-semibold mb-2">Dirección</h4>
          <AddressFields />
        </div>

        {/* Botones */}
        <FormFooter />
      </form>
    </FormProvider>
  );
};

export default FormAddOwner;
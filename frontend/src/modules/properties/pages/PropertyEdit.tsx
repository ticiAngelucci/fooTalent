import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Route } from "@/shared/constants/route";
import { useForm } from "react-hook-form";
import { PropertyFormData, PropertySchema } from "../schemas/property.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { PencilLine, Save, X } from "lucide-react";
import { editProperty, getOwnerList } from "../services/PropertyService";
import { TypeOfProperty } from "../enums/TypeOfProperty";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import DeletePropertyModal from "../components/DeletePropertyModal";

const PropertyEdit = () => {
  const location = useLocation();
  const property = location.state?.property;
  const [isDisabled, setDisabled] = useState(true);
  const [ownerList, setOwnerList] = useState([]);

  useEffect(() => {
    const getOwners = async () => {
      const owners = await getOwnerList();
      if (owners) setOwnerList(owners);
    };
    getOwners();
  }, []);

  const handleDisable = () => {
    setDisabled(!isDisabled);
  };

  const id = property.id_property;

  const navigate = useNavigate();
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(PropertySchema),
    defaultValues: {
      address: {
        country: property.country,
        province: property.province,
        locality: property.locality,
        street: property.street,
        number: property.number,
        postalCode: property.postalCode,
      },
      typeOfProperty: property.typeOfProperty,
      observations: property.observations,
      ownerId: property.ownerId,
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      await editProperty(id, data);
      toast.custom(
        () => (
          <SuccessToast
            title="Propiedad modificada con éxito"
            description="La propiedad ha sido editada y esta disponible en el sistema"
          />
        ),
        {
          duration: 5000,
        }
      );
      navigate(Route.Immovables);
    } catch (error) {
      toast.custom(
        () => (
          <ErrorToast
            title="¡Ha ocurrido un error!"
            description="La propiedad no se pudo editar, intente nuevamente."
          />
        ),
        {
          duration: 5000,
        }
      );
    }
  };

    if (!property) return null;

  return (
    <DashboardLayout subtitle="Añadir Inmueble" redirect={Route.Immovables}>
      <section className="p-6 rounded-[8px] border bg-white">
        <Form {...form}>
          <form
            className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h4 className="text-2xl font-semibold col-span-4">
              Datos del inmueble
            </h4>

            <FormField
              name="ownerId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="form-label-custom">
                    Propietario
                  </FormLabel>
                  <FormControl>
                    {isDisabled ? (
                      <Input
                        type="text"
                        value={`${property.firstName} ${property.lastName}`}
                        disabled={isDisabled ? true : false}
                      />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className="w-full form-input-custom">
                          <SelectValue placeholder="Seleccione un propietario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Propietarios</SelectLabel>
                            {ownerList.map(
                              ({ idOwner, firstName, lastName }) => (
                                <SelectItem key={idOwner} value={idOwner}>
                                  {firstName} {lastName}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />

            <FormField
              name="typeOfProperty"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="form-label-custom">
                    Tipo de Inmueble
                    <span className="text-neutral-600 font-normal">
                      (Requerido)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={isDisabled ? true : false}
                    >
                      <SelectTrigger className="w-full form-input-custom">
                        <SelectValue placeholder="Seleccione tipo de inmueble" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TypeOfProperty).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type
                              .toLowerCase()
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h4 className="text-base font-semibold col-span-4">Dirección</h4>

            <FormField
              name="address.street"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="form-label-custom">
                    Calle
                    <span className="text-neutral-600 font-normal">
                      (Requerido)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="form-input-custom"
                      placeholder="Ej: Av. Rivadavia"
                      {...field}
                      disabled={isDisabled ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.number"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="form-label-custom">
                    Número
                    <span className="text-neutral-600 font-normal">
                      (Requerido)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="form-input-custom"
                      placeholder="Ej: 12"
                      {...field}
                      disabled={isDisabled ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.postalCode"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="form-label-custom">
                    Código Postal
                    <span className="text-neutral-600 font-normal">
                      (Requerido)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="form-input-custom"
                      placeholder="Ej: 12154"
                      {...field}
                      disabled={isDisabled ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.locality"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="form-label-custom">
                    Localidad
                    <span className="text-neutral-600 font-normal">
                      (Requerido)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="form-input-custom"
                      placeholder="Ej: Flores"
                      {...field}
                      disabled={isDisabled ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              name="address.province"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="form-label-custom">
                    Provincia
                    <span className="text-neutral-600 font-normal">
                      (Requerido)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="form-input-custom"
                      placeholder="Ej: Buenos Aires"
                      {...field}
                      disabled={isDisabled ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.country"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="form-label-custom">
                    Pais
                    <span className="text-neutral-600 font-normal">
                      (Requerido)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="form-input-custom"
                      placeholder="Ej: Argentina"
                      {...field}
                      disabled={isDisabled ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="observations"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="form-label-custom">
                    Observaciones
                    <span className="text-neutral-600 font-normal">
                      (Requerido)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32 form-input-custom"
                      placeholder="Ej: Escriba aquí"
                      {...field}
                      disabled={isDisabled ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <Button
              type="submit"
              className="col-span-2 flex items-center w-full text-base btn-primary"
              disabled={isDisabled ? true : false}
            >
              <Save className="size-6 mr-2" /> Guardar
            </Button>
            <br />
            <Button
              type="button"
              className="col-span-2 btn-secondary"
              onClick={() => handleDisable()}
            >
              <PencilLine />
              {isDisabled ? "Editar" : "Cancelar"}
            </Button>
            <br />
            <DeletePropertyModal id={id}>
              <Button
                type="button"
                className="col-span-2 btn-tertiary"
                disabled={!isDisabled ? true : false}
              >
                <X />
                Eliminar
              </Button>
            </DeletePropertyModal>
          </form>
        </Form>
      </section>
    </DashboardLayout>
  );
};

export default PropertyEdit;

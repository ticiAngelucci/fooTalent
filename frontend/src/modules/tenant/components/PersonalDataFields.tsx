import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { WarrantyType } from "../enum/TenantEnum";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";


interface PersonalDataFieldsProps {
  disabled?: boolean;
  disableDni?: boolean;
}

const PersonalDataFields = ({ disabled, disableDni }: PersonalDataFieldsProps) => {
  const { control } = useFormContext();


  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre<span className="text-gray-500">(requerido)</span></FormLabel>
            <FormControl>
              <Input placeholder="Ingrese su nombre aquí" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apellido<span className="text-gray-500">(requerido)</span></FormLabel>
            <FormControl>
              <Input placeholder="Ingrese su apellido aquí" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="dni"
        render={({ field }) => (
          <FormItem>
            <FormLabel>DNI<span className="text-gray-500">(requerido)</span></FormLabel>
            <FormControl>
              <Input placeholder="Ej: 98999999" {...field} disabled={disableDni} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono</FormLabel>
            <FormControl>
              <Input placeholder="Ej: 1112345678" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo electrónico</FormLabel>
            <FormControl>
              <Input placeholder="Ej: correo@ejemplo.com" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="warranty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Garantía</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una garantía" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(WarrantyType).map((warranty) => (
                  <SelectItem key={warranty} value={warranty}>
                    {warranty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalDataFields;

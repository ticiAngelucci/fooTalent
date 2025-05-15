import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";


interface PersonalDataFieldsProps {
  disabled: boolean;
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
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Ej: correo@ejemplo.com" type="email" {...field} disabled={disabled} />
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
            <FormControl>
              <select
                {...field}
                disabled={disabled}
                className="border border-gray-500 rounded-md px-3 py-2 text-sm w-full"
              >
                <option value="0">Sin garantía</option>
                <option value="1">Garantía básica</option>
                <option value="2">Garantía extendida</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalDataFields;

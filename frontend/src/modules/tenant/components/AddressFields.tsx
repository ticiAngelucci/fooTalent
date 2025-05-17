import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

interface AddressFieldsProps {
  disabled?: boolean;
}

const AddressFields = ({ disabled }: AddressFieldsProps) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Pais</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Argentina" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="locality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localidad</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Rosario" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="street"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Calle</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Av. Rivadavia" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número</FormLabel>
            <FormControl>
              <Input placeholder="Ej: 1234" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provincia</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Buenos Aires" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código postal</FormLabel>
            <FormControl>
              <Input placeholder="Ej: 1234" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AddressFields;
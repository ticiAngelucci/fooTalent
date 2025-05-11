import { Button } from "@/shared/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Save } from 'lucide-react';

const FormFooter = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();


  return (
    <div className="flex justify-start pt-4 gap-4 w-full">
      <Button type="submit" disabled={isSubmitting} className="bg-brand-800 hover:bg-brand-600 w-[512px] rounded-lg">
        <Save size={24}/>{isSubmitting ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );
};

export default FormFooter;
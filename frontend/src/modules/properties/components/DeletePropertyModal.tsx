import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { deleteProperty } from "../services/PropertyService";
import { toast } from "sonner";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { useNavigate } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePropertyStore } from "@/modules/immovables/store/propertyStore";

interface Props {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DeletePropertyModal = ({ id, open, setOpen }: Props) => {
  const navigate = useNavigate();
  const {fetchProperties} = usePropertyStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Loading cambió a:", loading);
  }, [loading]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProperty(id);
      toast.custom(
        () => (
          <SuccessToast
            title="Propiedad eliminada con éxito"
            description="La propiedad ha sido eliminada con éxito"
          />
        ),
        { duration: 5000 }
      );
      fetchProperties();
      navigate(Route.Immovables);
    } catch (error) {
      const err = error as AxiosError<{
        errorCode: string;
        errorMessage: string;
        details: string[];
      }>;

      const isConflict = err.response?.status === 406;
      const detailMessage =
        err.response?.data?.details?.[0] ||
        "La propiedad está asociada a un contrato activo y no puede ser eliminada.";

      toast.custom(
        () => (
          <ErrorToast
            title="¡Ha ocurrido un error!"
            description={
              isConflict
                ? detailMessage
                : "La propiedad no se pudo eliminar, intente nuevamente."
            }
          />
        ),
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white rounded-[8px] gap-8 p-8 border border-neutral-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-neutral-950">
            Eliminar inmueble
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-neutral-600 font-normal">
            ¿Estás seguro que deseas eliminar el inmueble? Esta acción no es
            recuperable.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="btn-secondary flex-1/2 !pt-2 !px-4 rounded-[4px]">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="btn-destructive flex-1/2 !pt-2 !px-4 rounded-[4px]"
            onClick={handleDelete}
          >
            {loading ? (<Loader2 className="animate-spin !w-6 !h-6 mr-2" />) : ("")} Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePropertyModal;

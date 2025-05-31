import { Button } from "@/shared/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Save, Pencil, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DialogHeader } from "@/shared/components/ui/dialog";
import { useState } from "react";

interface FormFooterProps {
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const FormEditFooter = ({
  isEditing = false,
  onEdit,
  onCancel,
  onDelete,
  isDeleting = false,
}: FormFooterProps) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex flex-col gap-2 pt-4 w-1/2">
      <Button
        type="submit"
        disabled={isSubmitting || !isEditing}
        className="bg-brand-800 hover:bg-brand-600 w-full rounded-lg"
      >
        <Save size={24} /> {isSubmitting ? "Guardando..." : "Guardar"}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={isEditing ? onCancel : onEdit}
        className={`w-full border-zinc-900 ${
          isEditing ? "" : "text-neutral-950"
        }`}
      >
        {isEditing ? (
          <>
            <X size={20} className="mr-2" /> Cancelar
          </>
        ) : (
          <>
            <Pencil size={20} className="mr-2" /> Editar
          </>
        )}
      </Button>

      {onDelete && (
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpenDialog(true)}
            className="text-neutral-950 w-full"
          >
            <X size={20} className="mr-2" /> Eliminar inquilino
          </Button>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="bg-white rounded-lg p-6 shadow-xl h-52 w-[573px] flex flex-col justify-between">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-lg font-semibold">
                  Eliminar inquilino
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-600">
                  ¿Estás seguro que deseas eliminar inquilino? Esta acción no es
                  recuperable.
                </DialogDescription>
              </DialogHeader>

              <div className="w-full flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="w-1/2 btn-secondary"
                >
                  Cancelar
                </Button>

                <Button
                  onClick={() => {
                    onDelete();
                    setOpenDialog(false);
                  }}
                  disabled={isDeleting}
                  className="btn-destructive w-1/2 text-base font-semibold rounded-sm"
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin !w-6 !h-6 mr-2" />
                  ) : (
                    <>Eliminar</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default FormEditFooter;

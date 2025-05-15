import { Button } from "@/shared/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Save, Pencil, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eliminar inquilino</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro que deseas eliminar inquilino? Esta acción no es recuperable.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col-reverse justify-center items-center gap-4 pt-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete();
                    setOpenDialog(false);
                  }}
                  disabled={isDeleting}
                  className="w-full"
                >
                  {isDeleting ? "Eliminando..." : (
                    <>
                      <X size={20} />Eliminar
                    </>
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
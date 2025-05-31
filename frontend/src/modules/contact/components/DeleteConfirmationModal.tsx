import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  tipo: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmationModal({
  isOpen,
  tipo,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl h-52 w-[573px]">
        <h2 className="text-lg font-semibold mb-2">
          Eliminar {tipo === "inquilinos" ? "inquilino" : "propietario"}
        </h2>
        <p className="text-sm text-neutral-600 mb-10">
          ¿Estás seguro de que deseas eliminar el{" "}
          {tipo === "inquilinos" ? "inquilino" : "propietario"}? Esta acción no es
          recuperable.
        </p>
        <div className="w-full flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-1/2 text-base font-semibold rounded-sm !bg-white"
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            className="bg-error-600 hover:bg-error-700 w-1/2 text-base font-semibold rounded-sm"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="animate-spin !w-6 !h-6 mr-2" />
            ) : (
              ""
            )}
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}

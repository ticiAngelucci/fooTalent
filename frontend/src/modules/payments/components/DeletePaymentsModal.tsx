import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { toast } from "sonner";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { deletePayment } from "../service/paymentService";

interface Props {
    id:string;
    open: boolean;
    setOpen: (value: boolean) => void;
    loadPayments: () => Promise<void>;
}

const DeletePaymentsModal = ({ id, open, setOpen, loadPayments }: Props) => {
    const handleDelete = async()=>{
        try {
            await deletePayment(id);
            toast.custom(
                () => (
                    <SuccessToast title="Pago eliminada con éxito"
                        description="El pago ha sido eliminada con éxito" />
                ),
                {
                    duration: 5000,
                },
            );
            await loadPayments();
        } catch (error) {
            toast.custom(
                () => (
                    <ErrorToast title="¡Ha ocurrido un error!"
                        description="El pago no se pudo eliminar, intente nuevamente." />
                ),
                {
                    duration: 5000,
                }
            );
        }
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="bg-white rounded-[8px] gap-8 p-8 border border-neutral-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold text-neutral-950">Eliminar pago</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-neutral-600 font-normal">
                        ¿Estás seguro que deseas eliminar el pago? Esta acción no es recuperable.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="">
                    <AlertDialogCancel className="btn-secondary flex-1/2 !pt-2 !px-4 rounded-[4px]">Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="btn-destructive flex-1/2 !pt-2 !px-4 rounded-[4px]" onClick={handleDelete}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeletePaymentsModal
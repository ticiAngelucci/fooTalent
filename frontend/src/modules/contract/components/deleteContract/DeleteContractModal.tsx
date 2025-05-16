import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { toast } from "sonner";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { useNavigate } from 'react-router-dom';
import { Route } from "@/shared/constants/route";
import { deleteContract } from "../../services/deleteContract";


interface Props {
    id: number;
    open: boolean;
    setOpen: (value: boolean) => void;
}

const DeleteContractModal = ({ id, open, setOpen }: Props) => {
    const navigate = useNavigate();
    const handleDelete = async () => {
        try {
            await deleteContract(id);
            toast.custom(
                () => (
                    <SuccessToast
                        title="Contrato eliminado con éxito"
                        description="El contrato ha sido eliminado con éxito"
                    />
                ),
                {
                    duration: 5000,
                }
            );
            navigate(Route.Contracts);
        } catch (error: any) {
            if (error?.status === 406 || error?.response?.status === 406) {
                toast.custom(
                    () => (
                        <ErrorToast
                            title="¡Error!"
                            description="El contrato aún está activo y no puede eliminarse."
                        />
                    ),
                    { duration: 5000 }
                );
            } else {
                toast.custom(
                    () => (
                        <ErrorToast
                            title="¡Ha ocurrido un error!"
                            description="El contrato no se pudo eliminar, intente nuevamente."
                        />
                    ),
                    { duration: 5000 }
                );
            }
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="bg-white rounded-[8px] gap-8 p-8 border border-neutral-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold text-neutral-950">Eliminar Contrato</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-neutral-600 font-normal">
                        ¿Estás seguro que deseas eliminar el contrato? Esta acción no es recuperable
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

export default DeleteContractModal
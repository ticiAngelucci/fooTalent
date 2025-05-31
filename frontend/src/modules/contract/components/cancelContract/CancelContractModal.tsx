import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { toast } from "sonner";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { useNavigate } from 'react-router-dom';
import { Route } from "@/shared/constants/route";
import { cancelContract } from "../../services/cancelContractService";
import { useContractStore } from "../../store/contractStore";


interface Props {
    id: number;
    open: boolean;
    setOpen: (value: boolean) => void;
}

const CancelContractModal = ({ id, open, setOpen }: Props) => {
    const fetchContracts = useContractStore((state) => state.fetchContracts)
    const navigate = useNavigate();
    const handleCancel = async () => {
        try {
            await cancelContract(id);
            toast.custom(
                () => (
                    <SuccessToast
                        title="Contrato finalizado con éxito"
                        description="El contrato ha sido finalizado con éxito"
                    />
                ),
                {
                    duration: 5000,
                }
            );
            fetchContracts();
            navigate(Route.Contracts);
        } catch (error: any) {
            toast.custom(
                () => (
                    <ErrorToast
                        title="¡Error!"
                        description="Ocurrió un error al finalizar el contrato, intenta nuevamente"
                    />
                ),
                { duration: 5000 }
            );
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="bg-white rounded-[8px] gap-8 p-8 border border-neutral-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold text-neutral-950">Finalizar contrato</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-neutral-600 font-normal">
                        ¿Estás seguro que deseas finalizar el contrato? Esta acción no es recuperable.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="">
                    <AlertDialogCancel className="btn-secondary flex-1/2 !pt-2 !px-4 rounded-[4px]">Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="btn-destructive flex-1/2 !pt-2 !px-4 rounded-[4px]" onClick={handleCancel}>Estoy seguro</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CancelContractModal
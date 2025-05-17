import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import { deleteProperty } from "../services/PropertyService";
import { toast } from "sonner";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { useNavigate } from 'react-router-dom';
import { Route } from "@/shared/constants/route";


interface Props {
    children: React.ReactNode;
    id:string;
}

const DeletePropertyModal = ({ children, id }: Props) => {
    const navigate = useNavigate();
    const handleDelete = async()=>{
        try {
            await deleteProperty(id);
            toast.custom(
                () => (
                    <SuccessToast title="Propiedad eliminada con éxito"
                        description="La propiedad ha sido eliminada con éxito" />
                ),
                {
                    duration: 5000,
                },
            );
            navigate(Route.Immovables);
        } catch (error) {
            toast.custom(
                () => (
                    <ErrorToast title="¡Ha ocurrido un error!"
                        description="La propiedad no se pudo eliminar, intente nuevamente." />
                ),
                {
                    duration: 5000,
                }
            );
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-[8px] gap-8 p-8 border border-neutral-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold text-neutral-950">Eliminar Inmueble</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-neutral-600 font-normal">
                        ¿Estás seguro que deseas eliminar el inmueble? Esta acción no es recuperable
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

export default DeletePropertyModal
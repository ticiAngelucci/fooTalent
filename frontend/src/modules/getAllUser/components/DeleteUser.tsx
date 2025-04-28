import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/shared/components/ui/alert-dialog"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { CircleX } from "lucide-react"
import { userDelete } from "../services/UserServices"
import { Route } from "@/shared/constants/route";
import { useNavigate } from "react-router-dom";

interface DeleteUserProps {
    id: number;
  }
  
  const DeleteUser = ({ id }: DeleteUserProps) => {
    const navigate = useNavigate();
      const handleDelete = async () => {
          try {
              await userDelete(id);
              alert("Usuario borrado con éxito");
              navigate(Route.Dashboard);
          } catch (error: any) {
              alert(error.message);
          }
      };
  
      return (
          <AlertDialog>
              <AlertDialogTrigger>
                  <CircleX />
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      ¿Estás seguro de que quieres borrar este usuario?
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                      Una vez confirmado, el usuario será eliminado permanentemente.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                          Borrar
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      );
  };

  export default DeleteUser;
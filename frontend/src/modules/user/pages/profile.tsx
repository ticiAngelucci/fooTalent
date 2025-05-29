import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import FormName from "../components/formName";
import FormPassword from "../components/formPassword";
import { useEffect, useState } from "react";
import ModifiedPass from "../components/modifiedPass";
import { useUserStore } from "@/store/userStore";
import { getUser, uploadImage } from "../services/userService";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { toast } from "sonner";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";

const Profile = () => {
  const [info, setInfo] = useState("");
  const [imageUpdated, setImageUpdated] = useState(false);

  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser(token); // Usa await para obtener el resultado
        setInfo(data);
      } catch {
        console.error("Error al obtener el usuario:");
      }
    };

    fetchUser(); // Llamada a la función asíncrona
  }, [token, imageUpdated]);

  const [editPassword, setEditPassword] = useState(false);
  const [edited, setEdited] = useState(false);
  const handleEditPassword = () => {
    setEditPassword(true);
    setEdited(false);
  };

  const handleClose = () => {
    setEditPassword(false);
  };
  const editedPassword = () => {
    setEdited(!edited);
    setEditPassword(false);
  };
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png"];

    if (!validTypes.includes(file.type)) {
      toast.custom(
        () => (
          <ErrorToast
            title="Formato no permitido"
            description="Tu avatar debe ser una imagen en formato JPG o PNG."
          />
        ),
        { duration: 5000 }
      );
      return;
    }

    try {
     const userAvatar = await uploadImage(file);
      setImageUpdated((prev) => !prev);
      useUserStore.setState({ profileImageUrl: userAvatar.imageUrl });
      toast.custom(
        () => (
          <SuccessToast
            title="Avatar modificado"
            description="Tu avatar fue modificado exitosamente."
          />
        ),
        { duration: 5000 }
      );
    } catch (error) {
      toast.custom(
        () => (
          <ErrorToast
            title="¡Error al modificar tu avatar!"
            description="Tu avatar no pudo ser modificado. Por favor, intentá nuevamente."
          />
        ),
        { duration: 5000 }
      );
    }
  }
};


  return (
    <>
      <DashboardLayout subtitle="Mi perfil" redirect="/dashboard">
        <div className="bg-neutral-50 p-4">
          <div className="bg-white h-auto mr-4 md:mr-[30px] p-4 rounded-[8px] border border-neutral-200 flex flex-row">
            <div className="w-full md:w-[143px] flex-shrink-0 gap-[16px]">
              <img
                className="w-[100px] h-[100px] md:w-[143px] md:h-[143px] mx-auto rounded-full ml-[10px]"
                src={info.profileImageUrl}
                alt="Imagen de Perfil"
              />
              <Button
                asChild
                className="w-full md:w-[143px] h-[40px] mt-4 mx-auto rounded-[6px] border border-neutral-300 font-raleway font-semibold text-[16px] leading-[24px] tracking-[0%] ml-[10px] text-black bg-white hover:bg-neutral-50"
              >
                <label
                  htmlFor="fileInput"
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Pencil />
                  Editar foto
                </label>
              </Button>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                id="fileInput"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="w-[1px] h-[422px] bg-neutral-200 mt-[10px] ml-[30px]"></div>
            <div className="flex-grow ml-[30px]">
              <FormName onEditPassword={handleEditPassword} />
            </div>
          </div>
        </div>

        {editPassword && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.66)] flex items-center justify-center z-50">
            <FormPassword
              onCloseEdit={handleClose}
              onModifiedPassword={editedPassword}
            />
          </div>
        )}
        {edited && <ModifiedPass editedPassword={editedPassword} />}
      </DashboardLayout>
    </>
  );
};

export default Profile;

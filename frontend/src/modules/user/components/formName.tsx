import { useUserStore } from "@/store/userStore";
import React, { useEffect, useState } from "react";
import { PencilLine, Save, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getUser, setUser } from "../services/userService";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import { toast } from "sonner";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";

type FormNameProps = {
  onEditPassword: () => void;
};

type UserProps = {
  firstName: string;
  lastName: string;
};

const FormName: React.FC<FormNameProps> = ({ onEditPassword }) => {
  const { email } = useUserStore();
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [firstIsEditable, setFirstIsEditable] = useState<boolean>(false);
  const [lastIsEditable, setLastIsEditable] = useState<boolean>(false);
  const [info, setInfo] = useState<UserProps | null>(null);
  const token = useUserStore((state) => state.token);
  const setNewData = useUserStore((state) => state.getCredentials);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const data = await getUser(token);
          if (data) {
            setInfo(data);
            setFirstName(data.firstName);
            setLastName(data.lastName);
          }
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, [token]);

  const changeName = () => {
    setLastIsEditable(!lastIsEditable);
  };

  const changeFirstName = () => {
    setFirstIsEditable(!firstIsEditable);
  };

  const saveInfo = async () => {
    if (!info) return;

    try {
      const updatedInfo = { ...info, lastName, firstName };

      const editedUser = await setUser(updatedInfo);
      if (editedUser) {
        await setNewData();
        setLastIsEditable(false);
        setFirstIsEditable(false);
        toast.custom(
          () => (
            <SuccessToast title="Datos modificados con éxito!"
              description="Tus datos fueron modificados exitosamente." />
          ),
          {
            duration: 5000,
          }
        )

      } else {
        console.error("No se pudo actualizar el usuario.");
      }
    } catch (error) {
      toast.custom(
        () => (
          <ErrorToast title="¡Error al Modificar tus datos!"
            description="Tus datos no han sido modificados, por favor inténtelo nuevamente." />
        ),
        {
          duration: 5000,
        }
      )
    }
  };

  return (
    <div className="z-50">
      <div className="md:ml-[30px] flex-1">
        <span className="font-raleway font-semibold text-[24px]">
          Mis Datos
        </span>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 md:flex-nowrap">
            <div className="flex flex-col w-full md:w-1/2 relative">
              <span className="font-raleway font-semibold text-sm">Nombre</span>
              <input
                className={`h-[40px] rounded-[6px] w-full border border-neutral-300 px-2 mt-1 flex items-center font-raleway font-normal text-base leading-6 tracking-normal [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] justify-between ${!firstIsEditable ? ` bg-neutral-100` : `bg-white `
                  }`}
                value={firstName}
                disabled={!firstIsEditable}
                onChange={(e) => setFirstName(e.target.value)}
                pattern="/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/"
                minLength={3}
                maxLength={25}
              />
              <PencilLine
                className="w-[18px] h-[18px] text-neutral-500 absolute right-2 top-11 transform -translate-y-1/2 "
                onClick={changeFirstName}
              />
            </div>
            <div className="flex flex-col w-full md:w-1/2 relative">
              <span className="font-raleway font-semibold text-sm">Apellido</span>
              <input
                className={`h-[40px] rounded-[6px] w-full border border-neutral-300 px-2 mt-1 flex items-center justify-between ${!lastIsEditable ? ` bg-neutral-100` : `bg-white `
                  }`}
                value={lastName}
                disabled={!lastIsEditable}
                onChange={(e) => setLastName(e.target.value)}
                pattern="/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/"
                minLength={3}
                maxLength={25}
              />
              <PencilLine
                className="w-[18px] h-[18px] text-neutral-500 absolute right-2 top-11 transform -translate-y-1/2 "
                onClick={changeName}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 md:flex-nowrap">
            <div className="flex flex-col w-full md:w-1/2">
              <span className="font-raleway font-semibold text-sm">
                Correo electrónico
              </span>
              <span className="h-[40px] rounded-[6px] w-full border border-neutral-300 px-2 mt-1 bg-neutral-100 flex items-center font-raleway font-normal text-base leading-6 tracking-normal [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums]">
                {email}
              </span>
            </div>
          </div>
          <span className="font-raleway font-semibold text-2xl leading-8 tracking-normal mt-[10px] mb-[10px]">
            Seguridad
          </span>
          <div className="flex flex-wrap gap-4 md:flex-nowrap">
            <div className="flex flex-col w-full md:w-1/2">
              <span className="font-raleway font-semibold text-sm">
                Contraseña actual
              </span>
              <span className="h-[40px] rounded-[6px] w-full border border-neutral-300 px-2 mt-1 bg-neutral-100 flex items-center">
                *********
              </span>
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <Button
                onClick={onEditPassword}
                className="w-full h-[40px] bg-white text-black mt-6 hover:bg-neutral-50"
                style={{ borderColor: '#d1d5db' }}
              >
                <Shield width={16} height={20} />
                <p className="font-raleway font-semibold text-[16px] leading-[24px] tracking-[0] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums]">
                  Editar contraseña
                </p>
              </Button>
            </div>
          </div>
          <Button
            className="w-[452px] h-[40px] font-raleway font-semibold text-[16px] leading-[24px] tracking-[0%] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] text-white rounded-[6px] bg-brand-800 border border-neutral-300 mt-5 hover:bg-brand-700"
            onClick={saveInfo}
            disabled={(firstIsEditable || lastIsEditable) ? false : true}
          >
            <Save />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormName;

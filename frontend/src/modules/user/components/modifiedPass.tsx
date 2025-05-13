import { Check, X } from "lucide-react";
import React from "react";

type PasswordProps = {
  editedPassword: () => void;
};

const ModifiedPass: React.FC<PasswordProps> = ({ editedPassword }) => {
  return (
    <div className="fixed right-0 top-140 px-4">
      <div className="max-w-full w-[576px] h-[56px] bg-success-50 border rounded-[10px] border-success-700 text-success-700 flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <Check className="h-[24px] w-[24px] ml-5" />
          <span className="font-raleway font-semibold text-base leading-6 tracking-normal ml-3">
            Contraseña modificada con éxito
          </span>
        </div>
        <X
          className="text-neutral-600 h-[24px] w-[24px] mr-5 cursor-pointer"
          onClick={editedPassword}
        />
      </div>
    </div>
  );
};

export default ModifiedPass;

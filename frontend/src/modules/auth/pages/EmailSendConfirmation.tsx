import { useNavigate } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import { Button } from "@/shared/components/ui/button";

import { MailCheck } from "lucide-react";

import { useLocation } from "react-router-dom";



const EmailSentConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = location.state?.email || "correo@ejemplo.com";

    

    return (

        <div className="flex">
            
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
                <div className="w-full max-w-md px-6">
                    <div >

                        <div className="flex justify-center mb-4">
                            <MailCheck className="w-16 h-16 text-[#1E40AF]" />
                        </div>
                        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                            ¡Correo enviado!
                        </h2>

                        <div className="text-center mb-8">
                            <p className="text-gray-600 mb-2">
                                Hemos enviado un enlace a <span className="font-bold">{userEmail}</span>
                            </p>
                            <p className="text-gray-600">
                                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                            </p>
                        </div>

                        

                        <Button className="w-full cursor-pointer mt-3 rounded-[7px] bg-[#1E40AF] text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            onClick={() => navigate(Route.Login)}>


                            Volver al inicio

                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EmailSentConfirmation;
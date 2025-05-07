import { Button } from "@/shared/components/ui/button";
import { MailWarning } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Route } from "@/shared/constants/route";

import { useLocation } from "react-router-dom";

interface ErrorEmailNotFoundProps {
    
    onRetry?: () => void;
}

const ErrorEmailNotFound = ({ onRetry }: ErrorEmailNotFoundProps) => {

    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = location.state?.email || "correo@ejemplo.com";

    return (
        <div className="flex">
            
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
                <div className="w-full max-w-md px-6">
                    <div>
                        <div className="flex justify-center mb-4">
                            <MailWarning className="w-16 h-16 text-[#1E40AF]" />
                        </div>
                        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                            Ha ocurrido un error
                        </h2>

                        <div className="text-center mb-8">
                            <p className="text-gray-600 mb-2">
                                No hemos podido enviar el enlace a <span className="font-bold">{userEmail}</span>
                            </p>
                            <p className="text-gray-600">
                                Ingresa el correo nuevamente.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {onRetry && (
                                <Button
                                    className="w-full cursor-pointer rounded-[7px] bg-[#1E40AF] text-white hover:bg-blue-900"
                                    onClick={onRetry}
                                >
                                    Intentar nuevamente
                                </Button>
                            )}

                            <Button
                                className="w-full cursor-pointer rounded-[7px] bg-[#1E40AF] text-white hover:bg-blue-900"
                                onClick={() => navigate(Route.ForgotPassword)}
                            >
                                Volver al inicio
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorEmailNotFound;
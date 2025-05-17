import { Button } from "@/shared/components/ui/button";
import { MailWarning } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import AuthLayout from "../components/layout/AuthLayout";
import { useEffect, useState } from "react";

interface ErrorEmailNotFoundProps {
    onRetry?: () => void;
}

const ErrorEmailNotFound = ({ onRetry }: ErrorEmailNotFoundProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userEmail, setUserEmail] = useState<string>("correo@ejemplo.com");
    
    useEffect(() => {
        
        if (location.state && typeof location.state === 'object' && 'email' in location.state) {
            const email = location.state.email as string;
            if (email && email.trim() !== '') {
                console.log("Correo electrónico obtenido del estado:", email);
                setUserEmail(email);
                
                sessionStorage.setItem('errorEmail', email);
                return;
            }
        }
        
        
        const storedEmail = sessionStorage.getItem('errorEmail');
        if (storedEmail && storedEmail.trim() !== '') {
            console.log("Correo electrónico recuperado de sessionStorage:", storedEmail);
            setUserEmail(storedEmail);
        } else {
            console.log("No se pudo obtener un correo electrónico válido");
        }
    }, [location.state]);

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            navigate(Route.ForgotPassword);
        }
    };
    
    

    
    const displayEmail = userEmail && userEmail.includes('@') ? userEmail : "correo@ejemplo.com";

    return (
        <AuthLayout>
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
                                No hemos podido enviar el enlace a <span className="font-bold">{displayEmail}</span>
                            </p>
                            <p className="text-gray-600">
                                Ingresa el correo nuevamente.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full cursor-pointer rounded-[7px] bg-[#1E40AF] text-white hover:bg-blue-900"
                                onClick={handleRetry}
                            >
                                Intentar nuevamente
                            </Button>

                            
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ErrorEmailNotFound;
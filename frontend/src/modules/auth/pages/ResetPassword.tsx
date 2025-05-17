import { FormResetPassword } from "../components/FormResetPassword";
import type { ResetPasswordFormValues } from "../schemas/ResetPassword";
import { resetPassword } from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import edificio1 from "../assets/edificio1.png";

export const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener el token de la URL (query parameter)
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    // Validar que tenemos un token
    if (!token) {
      setError("Token de restablecimiento no encontrado o inválido");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Llamado a la API
      await resetPassword(data, token);
      
      // Success (mostrar mensaje de éxito y redirigir después de unos segundos)
      setSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Error al restablecer la contraseña:", error);
      setError(error.message || "Error al restablecer la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado Izquierdo - Fondo Azul con Logo y Texto */}
      <section className="hidden lg:flex lg:w-1/2 min-h-screen bg-[#BFDBFE] relative flex-col">
        {/* Logo */}
        <div className="absolute top-6 left-10">
          <img src="/Logo.svg" alt="Rentary" className="h-9" />
        </div>
        
        {/* Texto principal */}
        <div className="px-10 mt-32 relative z-30">
          <p className="text-[40px] font-bold leading-tight">
            <span className="text-[#1e40af]">Gestiona</span> tus alquileres de<br /> 
            forma <span className="text-[#1e40af]">fácil</span> y <span className="text-[#1e40af]">eficiente</span>
          </p>
        </div>

        {/* Botón casa */}
        <div className="absolute left-10 top-44 z-30 mt-20">
          <div className="bg-white p-3 rounded-lg shadow-sm w-12 h-12 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9.5L12 4L21 9.5" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 13V19.4C19 19.7314 18.7314 20 18.4 20H5.6C5.26863 20 5 19.7314 5 19.4V13" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        {/* Botón Agregar contrato */}
        <div className="absolute right-10 top-44 z-30 mt-20">
          <button className="bg-[#1e40af] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 font-medium shadow-sm">
            <span className="text-base">+</span>
            Agregar contrato
          </button>
        </div>

        {/* Etiqueta Disponible */}
        <div className="absolute left-10 bottom-44 z-30">
          <div className="bg-[#ecfdf5] text-[#059669] px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium shadow-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="8" fill="#10b981" />
            </svg>
            Disponible
          </div>
        </div>
        
        {/* Imagen edificio */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <img src={edificio1} alt="" className="w-full object-cover h-[500px]"/>
        </div>
      </section>
      
      {/* Lado Derecho - Formulario de Restablecimiento de Contraseña */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-4 text-green-500">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">¡Contraseña restablecida!</h2>
              <p className="text-gray-600 mb-4">Tu contraseña ha sido actualizada correctamente.</p>
              <p className="text-gray-500 text-sm">Serás redirigido a la página de inicio de sesión en unos segundos...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center lg:hidden mb-4">
                <img src="/Logo.svg" alt="Logo" className="h-10" />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <FormResetPassword onSubmit={handleResetPassword} />
              
              {isLoading && (
                <div className="mt-4 text-center text-gray-500 text-sm">
                  Procesando...
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;

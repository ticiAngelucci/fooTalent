import { FormResetPassword } from "../components/FormResetPassword";
import type { ResetPasswordFormValues } from "../schemas/ResetPassword";
import { resetPassword } from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
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
    </div>
  );
};

export default ResetPassword;

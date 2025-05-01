import { Button } from "@/shared/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Acá va el link de redirección a Google
    //window.location.href = "redireccion a google"
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      variant="outline"
      className="w-full cursor-pointer rounded-[7px] flex items-center justify-center gap-2 border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white shadow-sm"
      aria-label="Iniciar sesión con Google"
    >
      <FcGoogle className="w-6 h-6" />
      Google
    </Button>
  );
}

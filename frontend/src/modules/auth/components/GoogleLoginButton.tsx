import { Button } from "@/shared/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { API_URL } from "@/shared/constants/api";



export function GoogleLoginButton() {
  
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/oauth2/authorization/google`;
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      variant="outline"
      className="w-full cursor-pointer rounded-[7px] flex items-center justify-center gap-2 btn-secondary focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white shadow-sm"
      aria-label="Iniciar sesión con Google"
    >
      <FcGoogle className="w-6 h-6" />
      Iniciar con Google
    </Button>
  );
}

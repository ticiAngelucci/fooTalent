import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import { useUserStore } from "@/store/userStore";

export default function OauthRedirect() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        //aca falta agregar el username, cuando tengamos un endpoint que traiga los datos del usuario
      setUser(token, ""); 
      navigate(Route.Dashboard);
    } else {
      navigate(Route.Login);
    }
  }, [navigate, setUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-700">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4" />
      <p className="text-sm">Redirigiendo...</p>
    </div>
  );
}
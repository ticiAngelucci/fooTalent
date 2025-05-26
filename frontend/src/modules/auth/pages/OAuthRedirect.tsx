import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import { useUserStore } from "@/store/userStore";

export default function OauthRedirect() {
  const navigate = useNavigate();
  const setLogin = useUserStore((state) => state.login);
  const getUser = useUserStore((state) => state.getCredentials);

  useEffect(() => {
    const handleOauth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        sessionStorage.setItem("token", token);
        setLogin(token);
        await getUser();
        navigate(Route.Dashboard);
      } else {
        navigate(Route.Login);
      }
    };

    handleOauth();
  }, [navigate, setLogin, getUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-700">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4" />
      <p className="text-sm">Redirigiendo...</p>
    </div>
  );
}
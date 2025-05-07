import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { API_URL } from "@/shared/constants/api";

export default function OauthRedirect() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      sessionStorage.setItem("token", token); 

      axios
        .get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const user = res.data;
          setUser(token, user.firstName); 
          navigate(Route.Dashboard);
        })
        .catch((err) => {
          console.error("Error al obtener usuario:", err);
          navigate(Route.Login);
        });
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
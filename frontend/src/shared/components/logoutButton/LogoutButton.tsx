import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/shared/components/ui/button";
import { Route } from "@/shared/constants/route";

const LogoutButton = () => {
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(Route.Login);
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Cerrar sesión
    </Button>
  );
};

export default LogoutButton;
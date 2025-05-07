import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/shared/components/ui/button";
import { Route } from "@/shared/constants/route";
import { LogOut } from "lucide-react";

interface Props{
  collapsed: boolean;
}

const LogoutButton = ({collapsed}:Props) => {
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(Route.Login);
  };

  return (
      <Button
        onClick={handleLogout}
        variant={"ghost"}
        className="flex items-center w-full p-0"
      >
        <span className={`inline-flex ${collapsed ? "h-7 w-7" : "h-5 w-5"}`}>
          <LogOut className="h-full w-full text-neutral-950" />
        </span>
        {!collapsed && (
          <span className="text-neutral-950">Cerrar sesión</span>
        )}
      </Button>
  );
};

export default LogoutButton;

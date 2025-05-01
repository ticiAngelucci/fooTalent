import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/shared/components/ui/button";
import { Route } from "@/shared/constants/route";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(Route.Login);
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="bg-[#6C6B75] hover:bg-[#5c5b64] w-10 h-10 rounded-xl p-2"
      >
        <LogOut className="text-white w-5 h-5" />
      </Button>
      <span className="text-xs text-muted-foreground">Logout</span>
    </div>
  );
};

export default LogoutButton;

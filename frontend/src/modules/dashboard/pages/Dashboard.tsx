import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Route } from "@/shared/constants/route";

import { useUserStore } from "@/store/userStore";
import LogoutButton from "@/shared/components/logoutButton/LogoutButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username);

  if(!username) return null;

  const handleButtonClick = () => {    
    navigate(Route.GetAllUsers);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen relative">
      <div className="absolute top-5 left-5 flex items-center gap-2">
        {username && <p className="text-xl">Hola {username}!</p>}
      </div>
      <div className="absolute top-5 right-5">
        <LogoutButton/>
      </div>

      <h1 className="text-3xl">Dashboard</h1>
      
        <Button onClick={handleButtonClick}>
          Ver todos los usuarios
        </Button>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Route } from "@/shared/constants/route";

const Dashboard = () => {
  const [username, setUsername] = useState<string | null>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));
      console.log(decodedPayload);
      setUsername(decodedPayload.sub);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const handleButtonClick = () => {    
    navigate(Route.GetAllUsers);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen relative">
      <div className="absolute top-5 left-5 flex items-center gap-2">
        {username && <p className="text-xl">Hola {username}!</p>}
      </div>
      <div className="absolute top-5 right-5">
        <Button onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      <h1 className="text-3xl">Dashboard</h1>
      
      <button >
        <Button onClick={handleButtonClick}>
          Ver todos los usuarios
        </Button>
      </button>
    </div>
  );
};

export default Dashboard;

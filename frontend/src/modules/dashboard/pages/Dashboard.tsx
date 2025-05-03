import { useUserStore } from "@/store/userStore";
import LogoutButton from "@/shared/components/logoutButton/LogoutButton";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/sidebar/app-sidebar";
import { Button } from "@/shared/components/ui/button";
import { Route } from "@/shared/constants/route";

const Dashboard = () => {
  const username = useUserStore((state) => state.username);

  if(!username) return null;

  const handleButtonClick = () => {    
    navigate(Route.GetAllUsers);
  };

  return (<>
  <div className="fixed left-0 top-0 h-full z-50">
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  </div><div className="flex flex-col justify-center items-center h-screen relative">
      <div className="absolute top-5 left-5 flex items-center gap-2">
        {username && <p className="text-xl">Hola {username}!</p>}
      </div>
      <div className="absolute top-5 right-5">
        <LogoutButton />
      </div>

      <h1 className="text-3xl">Dashboard</h1>

      <Button onClick={handleButtonClick}>
        Ver todos los usuarios
      </Button>
    </div></>
  );
};

export default Dashboard;

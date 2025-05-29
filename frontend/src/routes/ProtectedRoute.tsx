import { Navigate, Outlet } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import { useUserStore } from "@/store/userStore";

const ProtectedRoute = () => {

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={Route.Login} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
import { useUserStore } from "@/store/userStore"
import { Navigate, Outlet } from "react-router-dom";
import { Route } from '@/shared/constants/route';

const SemiPublicRoute = () => {

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    console.log('[SemiPublicRoute] Access denied: User is already authenticated');
    return <Navigate to={Route.Dashboard} replace />
  }
  return <Outlet />
}

export default SemiPublicRoute;
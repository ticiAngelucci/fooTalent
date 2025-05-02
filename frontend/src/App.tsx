import { Routes, Route } from "react-router-dom";
import Register from "./modules/auth/pages/Register";
import Login from "./modules/auth/pages/Login";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import NotFound from "./modules/error/pages/404NotFound";
import ApiPublica from "./modules/publicApi/pages/ApiPublica";
import { Route as AppRoute } from "./shared/constants/route";
import GetAllUsers from "./modules/getAllUser/page/getAllUsers";
import ProtectedRoute from "./routes/ProtectedRoute";
import SemiPublicRoute from "./routes/SemiPublicRoute";


function App() {
  //despues eliminar es para probar en vercel
  return (
    <main>
      <Routes>
        {/* Public Routes */}
        <Route path={AppRoute.PublicApi} element={<ApiPublica />} />
        {/* Semi Public Routes */}
        <Route element={<SemiPublicRoute />}>
          <Route path={AppRoute.Register} element={<Register />} />
          <Route path={AppRoute.Login} element={<Login />} />
        </Route>
        {/* 404 Default Route */}
        <Route path="*" element={<NotFound />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={AppRoute.Dashboard} element={<Dashboard />} />
          <Route path={AppRoute.GetAllUsers} element={<GetAllUsers />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Register from "./modules/auth/pages/Register";
import Login from "./modules/auth/pages/Login";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import NotFound from "./modules/error/pages/404NotFound";
import ApiPublica from "./modules/publicApi/pages/ApiPublica";
import ProtectedNode from "./routes/ProtectedRoute";
import { Route as AppRoute }  from "./shared/constants/route";


function App() {
  
  return (
    <main>
      <Routes>
        {/* Public Routes */}
        <Route path={AppRoute.Register} element={ <Register />} />
        <Route path={AppRoute.Login} element={<Login />} />
        <Route path={AppRoute.PublicApi} element={<ApiPublica />} />
        {/* 404 Default Route */}
        <Route path="*" element={<NotFound />} />
        {/* Protected Routes */}
        <Route element={<ProtectedNode />}>
          <Route path={AppRoute.Dashboard} element={<Dashboard />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;

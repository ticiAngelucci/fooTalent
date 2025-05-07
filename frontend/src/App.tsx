import { Routes, Route } from "react-router-dom";
import Register from "./modules/auth/pages/Register";
import Login from "./modules/auth/pages/Login";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Contact from "./modules/contact/pages/Contact";
import Immovables from "./modules/immovables/pages/Immovables";
import NotFound from "./modules/error/pages/404NotFound";
import ApiPublica from "./modules/publicApi/pages/ApiPublica";
import { Route as AppRoute } from "./shared/constants/route";
import GetAllUsers from "./modules/getAllUser/page/getAllUsers";
import ProtectedRoute from "./routes/ProtectedRoute";
import SemiPublicRoute from "./routes/SemiPublicRoute";
import OauthRedirect from "./modules/auth/pages/OAuthRedirect";
import SidebarLayout from "./shared/components/layout/SidebarLayout";
import ForgotPassword from "./modules/auth/pages/ForgotPassword";
import EmailSentConfirmation from "./modules/auth/pages/EmailSendConfirmation";
import ErrorEmailNotFound from "./modules/auth/pages/ErrorEmailNotFound";



function App() {
  return (
    <main>
      <Routes>
        {/* Public Routes */}
        <Route path={AppRoute.PublicApi} element={<ApiPublica />} />
        {/* Semi Public Routes */}
        <Route element={<SemiPublicRoute />}>
          <Route path={AppRoute.Register} element={<Register />} />
          <Route path={AppRoute.Login} element={<Login />} />
          <Route path={AppRoute.Google} element={<OauthRedirect />} />
          <Route path={AppRoute.ForgotPassword} element={<ForgotPassword />} />        
          <Route path={AppRoute.EmailSendConfirmation} element={<EmailSentConfirmation />} />
          <Route path={AppRoute.ErrorEmailNotFound} element={<ErrorEmailNotFound/>} />
        </Route>
        {/* 404 Default Route */}
        <Route path="*" element={<NotFound />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SidebarLayout />}>
            <Route path={AppRoute.GetAllUsers} element={<GetAllUsers />} />
            <Route path={AppRoute.Dashboard} element={<Dashboard />} />
            <Route path={AppRoute.Contact} element={<Contact />} />
            <Route path={AppRoute.Immovables} element={<Immovables />} />
          </Route>
        </Route>
      </Routes>
    </main >
  );
}

export default App;

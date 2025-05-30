import { Routes, Route } from "react-router-dom";
import Register from "./modules/auth/pages/Register";
import Login from "./modules/auth/pages/Login";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import LandingPage from "./modules/landingPage/page/LandingPage";
import Immovables from "./modules/immovables/pages/Immovables";
import NotFound from "./modules/error/pages/404NotFound";
import { Route as AppRoute } from "./shared/constants/route";
import ProtectedRoute from "./routes/ProtectedRoute";
import SemiPublicRoute from "./routes/SemiPublicRoute";
import OauthRedirect from "./modules/auth/pages/OAuthRedirect";
import ForgotPassword from "./modules/auth/pages/ForgotPassword";
import EmailSentConfirmation from "./modules/auth/pages/EmailSendConfirmation";
import ErrorEmailNotFound from "./modules/auth/pages/ErrorEmailNotFound";
import ResetPassword from "./modules/auth/pages/ResetPassword";
import AddOwner from "./modules/owner/pages/AddOwner";
import AddTenant from "./modules/tenant/pages/AddTenant";
import PropertyRegister from "./modules/properties/pages/PropertyRegister";
import { Toaster } from "@/shared/components/ui/sonner";
import EditOwner from "./modules/owner/pages/EditOwner";
import PropertyEdit from "./modules/properties/pages/PropertyEdit";
import Profile from "./modules/user/pages/profile";
import EditTenantPage from "./modules/tenant/pages/EditTenant";
import PaymentsView from "./modules/payments/pages/Payments";
import ListContracts from "./modules/contract/pages/ListContracts";
import AddContract from "./modules/contract/pages/AddContract";
import EditContract from "./modules/contract/pages/EditContract";
import ContactsView from "./modules/contact/pages/ContactsView";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Semi Public Routes */}
        <Route element={<SemiPublicRoute />}>
          <Route path={AppRoute.Register} element={<Register />} />
          <Route path={AppRoute.Login} element={<Login />} />
          <Route path={AppRoute.Google} element={<OauthRedirect />} />
          <Route path={AppRoute.ForgotPassword} element={<ForgotPassword />} />
          <Route
            path={AppRoute.EmailSendConfirmation}
            element={<EmailSentConfirmation />}
          />
          <Route
            path={AppRoute.ErrorEmailNotFound}
            element={<ErrorEmailNotFound />}
          />
          <Route path={AppRoute.ResetPassword} element={<ResetPassword />} />
        </Route>

        {/* 404 Default Route */}
        <Route path="*" element={<NotFound />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={AppRoute.Dashboard} element={<Dashboard />} />
          <Route path={AppRoute.Profile} element={<Profile />} />
          <Route path={AppRoute.Immovables} element={<Immovables />} />
          <Route path={AppRoute.NewProperty} element={<PropertyRegister />} />
          <Route path={AppRoute.EditProperty} element={<PropertyEdit />} />
          <Route path={AppRoute.Contact} element={<ContactsView />} />
          <Route path={AppRoute.AddOwner} element={<AddOwner />} />
          <Route path={AppRoute.AddTenant} element={<AddTenant />} />
          <Route path={AppRoute.EditOwner} element={<EditOwner />} />
          <Route path={AppRoute.EditTenant} element={<EditTenantPage />} />
          <Route path={AppRoute.Payments} element={<PaymentsView />} />
          <Route path={AppRoute.Contracts} element={<ListContracts />} />
          <Route path={AppRoute.NewContract} element={<AddContract />} />
          <Route path={AppRoute.EditContract} element={<EditContract />} />
        </Route>
      </Routes>
      <Toaster richColors closeButton position="bottom-right" />
    </>
  );
}

export default App;

import { Route } from "@/shared/constants/route";
import { Navigate, Outlet } from "react-router-dom";

//this Node protects routes from non authorized users.
export default function ProtectedNode() {
    //change this logic later once user context is developed
    const isAuthenticated = true;

    if (!isAuthenticated) {
        console.log('Access denied please log in first');
        //if user isn'nt authorized will redirect to login page
        return <Navigate to={Route.Login} />;
    }

    // Else outlet wil redirect to the pretended node.
    return <Outlet />;
}
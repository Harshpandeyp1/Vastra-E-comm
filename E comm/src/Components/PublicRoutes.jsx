import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../Service/Profile";

const PublicRoutes = ({ children }) => {

    if (isAuthenticated()) {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.role === "MERCHANT") {
            return <Navigate to="/merchant/dashboard" replace />;
        }

        if (user?.role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/main" replace />;
    }

    return children;
};

export default PublicRoutes;
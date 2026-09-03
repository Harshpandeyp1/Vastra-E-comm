import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../Service/Profile";

const ProtectedRoutes = ({ children, allowedRoles }) => {

    // User is not logged in
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Get logged-in user
    const user = JSON.parse(localStorage.getItem("user"));

    // User exists but has no role
    if (!user || !user.role) {
        return <Navigate to="/login" replace />;
    }

    // Routes without an explicit role list are customer routes.
    if (!allowedRoles || allowedRoles.length === 0) {
        if (user.role === "MERCHANT") {
            return <Navigate to="/merchant/dashboard" replace />;
        }

        if (user.role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return children;
    }

    // Check whether user's role is allowed
    if (!allowedRoles.includes(user.role)) {
        // Merchant trying to access customer/admin page
        if (user.role === "MERCHANT") {
            return <Navigate to="/merchant/dashboard" replace />;
        }

        // Admin trying to access another role's page
        if (user.role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        // Normal user
        return <Navigate to="/main" replace />;
    }

    return children;
};

export default ProtectedRoutes;
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../Service/Profile";

const ProtectedRoutes = ({ children }) => {

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoutes;
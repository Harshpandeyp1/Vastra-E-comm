import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../Service/Profile";

const PublicRoutes = ({ children }) => {

    if (isAuthenticated()) {
        return <Navigate to="/main" replace />;
    }

    return children;
};

export default PublicRoutes;
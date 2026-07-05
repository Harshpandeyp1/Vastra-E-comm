import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../Service/Profile";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [hasSession, setHasSession] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const validSession = isAuthenticated();
        setHasSession(validSession);
        setIsReady(true);

        if (!validSession) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    if (!isReady) {
        return null;
    }

    if (!hasSession) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
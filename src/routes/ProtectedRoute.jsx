import React from 'react'
import {Navigate, useLocation} from 'react-router-dom'
import {useAuth} from "../context/AuthContext";

const ProtectedRoute = ({ children, roles = [] }) => {
    const {isAuthenticated, user, loading} = useAuth();
    const location = useLocation();

    if (loading) {
        return (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка...</p>
        </div>
    );
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles.length > 0 && user?.role) {
        if (!roles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }
    return children;
};
export default ProtectedRoute;

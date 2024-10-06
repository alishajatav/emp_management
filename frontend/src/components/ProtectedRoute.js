// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log("==================",isAuthenticated())
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />; // Redirect to login if not authenticated
    }

    return children; // Render the children if authenticated
};

export default ProtectedRoute;

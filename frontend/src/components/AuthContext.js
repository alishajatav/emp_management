// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    //const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    const login = (token) => {
        //setIsAuthenticated(true);
        setToken(token); // Store the passed token
        localStorage.setItem('token', token); // Store token in local storage
    };

    const logout = () => {
        //setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem('token'); // Remove token from local storage
    };

    const isAuthenticated = () =>{
        const token = localStorage.getItem('token');
        if(token)
            return true
        return false;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

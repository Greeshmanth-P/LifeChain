// frontend/src/context/AuthContext.js

import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider (the component that holds the "global state")
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // By default, no user is logged in

    // The "login" function will be called by our Login page
    const login = (userData) => {
        setUser(userData);
        // We can also save this to localStorage later to keep them logged in
    };

    // The "logout" function
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom "hook" (an easy way to access the context)
export const useAuth = () => {
    return useContext(AuthContext);
};
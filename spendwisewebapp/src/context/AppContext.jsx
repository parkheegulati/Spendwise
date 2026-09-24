import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [user, setUserState] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const setUser = (userData) => {
        setUserState(userData);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
    };

    const clearUser = () => {
        setUserState(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const contextValue = {
        user,
        setUser,
        clearUser
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
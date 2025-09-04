import React, { createContext, useContext, useState, useEffect } from "react";

// Create the session context
const SessionContext = createContext();

// Session provider component
export const SessionProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Check if user has a valid session on app load
  useEffect(() => {
    const checkSession = () => {
      const userId = localStorage.getItem("userId");
      const sessionToken = localStorage.getItem("sessionToken");

      // Simple check - if both userId and sessionToken exist, consider authenticated
      if (userId && sessionToken) {
        setIsAuthenticated(true);
        // You can fetch user data here if needed
        setUserData({ userId });
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }

      setIsLoading(false);
    };

    checkSession();
  }, []);

  // Login function - call this after successful login
  const login = (userId, additionalData = {}) => {
    const sessionToken = "session_" + Date.now(); // Simple session token

    localStorage.setItem("userId", userId);
    localStorage.setItem("sessionToken", sessionToken);

    setIsAuthenticated(true);
    setUserData({ userId, ...additionalData });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("sessionToken");

    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <SessionContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userData,
        login,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Hook to use session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

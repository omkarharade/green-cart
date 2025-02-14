"use client";
import { createContext, useContext, useState, useEffect} from "react";

// Create the AuthContext
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [userContext, setUserContext] = useState(null);
  const [tokenContext, setTokenContext] = useState(null);
  const [refreshTokenContext, setRefreshTokenContext] = useState(null);

  // Load user details from localStorage when the app loads
  useEffect(() => {
    const customerId = sessionStorage.getItem("customerId");
    const isAdmin = sessionStorage.getItem("isAdmin");
    const token = sessionStorage.getItem("jwt_token");
    const refreshToken = sessionStorage.getItem("jwt_refresh_token");

    setUserContext({customerId: customerId, isAdmin: isAdmin});
    setTokenContext(token);
    setRefreshTokenContext(refreshToken);

  }, []);


  // Function to update user details & store token
  const loginContext = (userData, token, refreshToken) => {
    setUserContext(userData);
    setTokenContext(token);
    setRefreshTokenContext(refreshToken);

    sessionStorage.setItem("customerId", userData.customerId)
    sessionStorage.setItem("isAdmin", userData.isAdmin)
    sessionStorage.setItem("jwt_token", token);
    sessionStorage.setItem("jwt_refresh_token", refreshToken);

  };

  // Function to logout & clear storage
  const logoutContext = () => {
    setUserContext(null);
    setTokenContext(null);
    setRefreshTokenContext(null);

    sessionStorage.removeItem("customerId", userData.customerId)
    sessionStorage.removeItem("isAdmin", userData.isAdmin)
    sessionStorage.removeItem("jwt_token", token);
    sessionStorage.removeItem("jwt_refresh_token", refreshToken);
  };

  return (
    <AuthContext.Provider value={{ userContext, tokenContext, refreshTokenContext, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => useContext(AuthContext);

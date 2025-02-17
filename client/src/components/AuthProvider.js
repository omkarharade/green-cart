"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar/Navbar";

const AuthProvider = ({ children }) => {
  const [isAuthentic, setIsAuthentic] = useState(false);

  useEffect(() => {
    // Initial check for authentication status
    const storedIsAuthentic = sessionStorage.getItem("isUserAuthenticated");
    setIsAuthentic(storedIsAuthentic ? JSON.parse(storedIsAuthentic) : false);
  }, []); // Only run once on mount

  // Listen for changes to sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedIsAuthentic = sessionStorage.getItem("isUserAuthenticated");
      setIsAuthentic(storedIsAuthentic ? JSON.parse(storedIsAuthentic) : false);
    };

    // Set up event listener for sessionStorage changes
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Only need to set this up once on mount

  return (
    <>
      <Navbar/>
      {children}
    </>
  );
};

export default AuthProvider;

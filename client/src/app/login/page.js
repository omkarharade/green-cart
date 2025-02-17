"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../../apiConfig";
import TokenRefresher from "../../utils/token"; 
import { useRouter } from 'next/navigation';

function Login() {
  let [uname, setUname] = useState("");
  let [password, setPass] = useState("");
  let [error, setError] = useState(""); // Error state for API errors
  const router = useRouter();

  useEffect(() => {
    const isAuthentic = JSON.parse(sessionStorage.getItem("isUserAuthenticated"));
    if (isAuthentic) {
      router.push("/view/");
    }
  }, []);

  function handleClick() {
    if (validateInputs()) {
      const user = { email: uname, password: password };
      let url = `${getBaseURL()}api/users/login`;

      axios
        .post(url, { ...user })
        .then((res) => {
          if (res.data.length > 0) {
            const isUserAdmin = res.data[0].isAdmin;
            sessionStorage.setItem("isUserAuthenticated", true);
            sessionStorage.setItem("userId", res.data[0].userId);
            sessionStorage.setItem("isAdmin", isUserAdmin ? true : false);
            sessionStorage.setItem("jwt_token", res.data[0].token);
            sessionStorage.setItem("jwt_refresh_token", res.data[0].refreshToken);
            TokenRefresher(res.data[0].refreshToken);
            
            router.push("/view");
          } else {
            setError("Invalid email or password"); // Fallback error if API does not provide one
          }
        })
        .catch((err) => {
          // Set error from API response if available, otherwise use a generic message
          setError(err || "Something went wrong. Please try again.");
        });
    }
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function validateInputs() {
    if (!validateEmail(uname)) {
      setError("Please provide a valid email address.");
      return false;
    } else if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  }

  function changeName(event) {
    setUname(event.target.value);
  }

  function changePass(event) {
    setPass(event.target.value);
  }

  return (
    <div className="flex justify-center items-center bg-[url('/images/cover-image.jpg')] h-screen bg-cover bg-center">
      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Login</h1>

        <div className="mb-4">
          <label className="block text-left">E-Mail</label>
          <input
            className="w-full p-2 my-2 border border-gray-300 rounded text-lg"
            type="text"
            placeholder="Enter Email"
            value={uname}
            onChange={changeName}
          />
        </div>

        <div>
          <label className="block text-left">Password</label>
          <input
            type="password"
            value={password}
            onChange={changePass}
            className="w-full p-2 my-2 border border-gray-300 rounded text-lg"
            placeholder="Enter Password"
          />
        </div>

        {/* Show API error message dynamically */}
        {error && (
          <div className="bg-red-600 text-white p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <button
          className="w-full p-2 bg-green-700 text-white rounded text-lg hover:bg-green-800 mt-3"
          onClick={handleClick}
        >
          Login
        </button>

        <p className="mt-3 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-green-700 font-bold hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;

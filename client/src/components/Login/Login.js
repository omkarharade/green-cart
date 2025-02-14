import React, { useState } from "react";
import axios from "axios";
import "./Login.scss";
import { getBaseURL } from "../apiConfig";
import TokenRefresher from "../Utils/token"; 

function Login(props) {
  let [uname, setUname] = useState("");
  let [password, setPass] = useState("");
  let [error, setError] = useState("");

  // Adding click handler
  function handleClick() {
    if (validateInputs()) {
      const user = {
        email: uname,
        password: password,
      };
      let url = `${getBaseURL()}api/users/login`;
      axios
        .post(url, { ...user })
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            console.log("Logged in successfully");
            sessionStorage.setItem("isUserAuthenticated", true);
            const user = res.data[0].isAdmin;
            sessionStorage.setItem("customerId", res.data[0].userId);
            sessionStorage.setItem("isAdmin", user ? true : false);
            sessionStorage.setItem("jwt_token", res.data[0].token);
            sessionStorage.setItem("jwt_refresh_token", res.data[0].refreshToken);
            TokenRefresher(res.data[0].refreshToken);
            props.setUserAuthenticatedStatus(user ? true : false, res.data[0].userId);
          } else {
            console.log("User not available");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    }
  }

  // Function to validate email format
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Function to validate password length
  function validatePassword(password) {
    return password.length >= 6;
  }

  // Function to validate inputs
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

  // Function to handle changes in email input
  function changeName(event) {
    setUname(event.target.value);
  }

  // Function to handle changes in password input
  function changePass(event) {
    setPass(event.target.value);
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: "images/cover-image.jpg"}}>
        <div className="w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-6 text-center">

        <h1 className="text-2xl font-bold text-green-700 mb-4">Login</h1>
        <div>
          <label>E-Mail</label>
          <input className="w-full p-2 my-2 border border-gray-300 rounded text-lg" type="text" value={uname} onChange={changeName}></input>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={changePass}
            className="w-full p-2 my-2 border border-gray-300 rounded text-lg"
          ></input>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="w-full p-2 bg-green-700 text-white rounded text-lg hover:bg-green-800" onClick={handleClick}>Login</button>

        <p className="mt-3 text-sm">
          Don't have an account? <span onClick={() => props.navigateToRegisterPage()} className="text-green-700 font-bold hover:underline">Register here</span>
        </p>

        </div>
      </div>
    </>
  );
}

export default Login;

"use client"

import React, { useState } from "react";
import axios from "axios";
import { getBaseURL } from "../../apiConfig";
import { redirect } from "next/navigation"

function Register(props) {
	let [email, setEmail] = useState("");
	let [fname, setFname] = useState("");
	let [lname, setLname] = useState("");
	let [pass, setPass] = useState("");
	const [isAdmin, setAdmin] = useState("0");
	const [error, setError] = useState("");


	const handleUserRegistration = () => {
		if (validateInputs()) {
			const newUser = {
				email: email,
				password: pass,
				isAdmin: isAdmin,
				fname: fname,
				lname: lname,
			};

			console.log("new user = ", newUser);

			let url = `${getBaseURL()}api/users/register`;
			axios
				.post(url, { ...newUser })
				.then((res) => {

					console.log("res.data", res.data);
					if (res.data != null) {
						console.log("User registered successfully");
						// props.navigateToLoginPage()
						redirect("/login");
					}
				})
				.catch((err) => console.log("Sorry unable to add new user"));
		}
	};

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const validatePassword = (password) => {
		return password.length >= 6;
	};

	const validateInputs = () => {
		if (!validateEmail(email)) {
			setError("Please provide a valid email address.");
			return false;
		} else if (fname.trim() === "") {
			setError("Please provide your first name.");
			return false;
		} else if (lname.trim() === "") {
			setError("Please provide your last name.");
			return false;
		} else if (!validatePassword(pass)) {
			setError("Password must be at least 6 characters long.");
			return false;
		}
		setError("");
		return true;
	};

	const updateAdmin = (adminValue) => {
		setAdmin(adminValue);
	};

	return (
		<div className="flex justify-center items-center bg-[url('/images/cover-image.jpg')] h-screen bg-cover bg-center">
			<div className="w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-6 text-center">
				<h1 className="text-2xl font-bold text-green-700 mb-4">Register</h1>
				<div className="my-3 flex flex-col">
					<label>E-Mail</label>
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="Email"
					></input>
				</div>
				<div className="my-3">
					<label>First Name</label>
					<input
						type="text"
						value={fname}
						onChange={(e) => setFname(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="First Name"
					></input>
				</div>
				<div className="my-3">
					<label>Last Name</label>
					<input
						type="text"
						value={lname}
						onChange={(e) => setLname(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="Last Name"
					></input>
				</div>
				<div className="my-3">
					<label>Password</label>
					<input
						type="password"
						value={pass}
						onChange={(e) => setPass(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="Password"
					></input>
				</div>
				{error && (
					<div className="bg-red-600 text-white p-2 mb-4 rounded">{error}</div>
				)}

				<div className="flex flex-row my-4 justify-evenly w-full">
					<div className="flex flex-row">
						<input
							type="radio"
							id="customer"
							name="role"
							value="0"
							checked={isAdmin === "0"}
							onChange={() => updateAdmin("0")}
							className="p-2 border border-gray-300 rounded mx-2"
						/>
						<label htmlFor="customer">Customer</label>
					</div>

					<div className="flex flex-row">
						<input
							type="radio"
							id="admin"
							name="role"
							value="1"
							checked={isAdmin === "1"}
							onChange={() => updateAdmin("1")}
							className="p-2 border border-gray-300 rounded mx-2"
						/>
						<label htmlFor="admin">Admin</label>
					</div>
				</div>
				<div>
					<button
						className="w-full p-2 bg-green-700 text-white rounded text-lg hover:bg-green-800"
						onClick={handleUserRegistration}
					>
						Register
					</button>
				</div>

				<div>
					<p className="mt-4 text-sm">
						Already have an account?{" "}
						<a
							href="/login"
							className="text-green-700 font-bold hover:underline"
						>
							Login here
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Register;

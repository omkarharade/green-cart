"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../../../../apiConfig";
import formatDateIST from "../../../../utils/formatDateIST";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const navLinks = [
		{ name: "products", route: "/view/customer" },
		{ name: "cart", route: "/view/customer/cart" },
		{ name: "past orders", route: "/view/customer/orders" },
	];

	return (
		<nav className="bg-green-700 p-4 text-white">
			<div className="flex justify-between items-center">
				{/* Logo */}
				<div className="text-2xl font-bold">GreenLiving</div>

				{/* Navigation Links - Hidden on Mobile */}
				<div className="hidden md:flex space-x-4">
					{navLinks.map((link, index) => (
						<a key={index} href={link.route} className="hover:underline">
							{link.name}
						</a>
					))}
				</div>

				<div className="flex flex-row">
					{/* Search & Icons */}
					<div className="flex space-x-4">
						<input
							type="text"
							placeholder="Search..."
							className="p-1 rounded text-black"
						/>
						<i className="fas fa-search cursor-pointer"></i>
						<a href="login.html">
							<i className="fas fa-user cursor-pointer"></i>
						</a>
						<a href="cart.html">
							<i className="fas fa-shopping-cart cursor-pointer"></i>
						</a>
					</div>

					{/* Hamburger Icon for Mobile */}
					<button
						className="md:hidden text-white text-2xl"
						onClick={() => setIsOpen(!isOpen)}
					>
						☰
					</button>
				</div>
			</div>

			{/* Mobile Menu (Shown when isOpen is true) */}
			{isOpen && (
				<div className="md:hidden flex flex-col space-y-2 mt-4 bg-green-800 p-4 rounded">
					{navLinks.map((link, index) => (
						<a key={index} href="#" className="block hover:underline">
							{link}
						</a>
					))}
				</div>
			)}
		</nav>
	);
};

const CustomerOrders = () => {
	const [orders, setOrders] = useState([]);
	const [groupedOrders, setGroupedOrders] = useState({});
	const userId = sessionStorage.getItem("userId");

	useEffect(() => {
		if (!userId) return;
		axios
			.get(`${getBaseURL()}api/orders/myPastOrders/${userId}`)
			.then((res) => {
				setOrders(res.data);
			})
			.catch((err) => console.log("Error fetching orders:", err));
	}, []);

	useEffect(() => {
		// Group orders by orderId
		const grouped = orders.reduce((acc, order) => {
			if (!acc[order.orderId]) {
				acc[order.orderId] = [];
			}
			acc[order.orderId].push(order);
			return acc;
		}, {});
		setGroupedOrders(grouped);
	}, [orders]);

	return (
		<div>
			{/* Navbar */}
			<Navbar />

			<div className="max-w-5xl mx-auto p-6">
				<h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
					My Orders
				</h1>
				{Object.keys(groupedOrders).length > 0 ? (
					Object.keys(groupedOrders).map((orderId) => (
						<div
							key={orderId}
							className="border rounded-lg p-6 shadow-lg mb-6 bg-white"
						>
							<h2 className="text-xl font-semibold mb-2 text-gray-800">
								Order ID: {orderId}
							</h2>
							<p className="text-gray-600 text-sm mb-4">
								Order Date:{" "}
								{formatDateIST(groupedOrders[orderId][0].createdDate)}
							</p>
							<div className="flex flex-wrap gap-6">
								{groupedOrders[orderId].map((order) => (
									<div
										key={order.name}
										className="border rounded-lg p-4 shadow-md bg-gray-50 hover:shadow-lg transition-all"
										style={{ width: "250px", height: "300px" }} // Fixed Width & Height
									>
										<img
											src={order.imageURL}
											alt={order.name}
											className="w-full h-40 object-cover rounded-md mb-3"
										/>
										<h3 className="text-lg font-semibold text-gray-800">
											{order.name}
										</h3>
										<p className="text-gray-600">Quantity: {order.quantity}</p>
										<p className="text-green-700 font-bold">
											Total Price: ₹{order.totalPrice}
										</p>
									</div>
								))}
							</div>
						</div>
					))
				) : (
					<p className="text-gray-600 text-center mt-10">
						No past orders found.
					</p>
				)}
			</div>
		</div>
	);
};

export default CustomerOrders;

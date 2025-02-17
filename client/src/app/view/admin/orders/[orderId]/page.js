"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../../../../../apiConfig";
import formatDateIST from "../../../../../utils/formatDateIST";
import { useParams, useRouter } from "next/navigation";


const OrderDetails = () => {
	const [order, setOrder] = useState(null);
	const [productsInOrder, setProductsInOrder] = useState([]);
	const { orderId } = useParams(); // Get the order ID dynamically
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		axios
			.get(`${getBaseURL()}api/orders/${orderId}`)
			.then((res) => setOrder(res.data[0]))
			.catch((err) => console.log("Error fetching order details"));

		axios
			.get(`${getBaseURL()}api/orders/getProductsByOrder/${orderId}`)
			.then((res) => {
				setProductsInOrder(res.data);
				console.log("products res.data === ", res.data);
			})
			.catch((err) => console.log("Error fetching order products"))
			.finally(setLoading(false));
	}, [orderId]);

	if (!order) {
		return (
			<p className="text-center text-gray-500">Loading order details...</p>
		);
	}

	const onBackClick = () => {
		router.push("/view/admin/orders");
	};

	return (
		<>
			<div className="max-w-5xl mx-auto p-6">
				{/* Back Button */}
				<button
					onClick={onBackClick}
					className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
				>
					Back
				</button>

				{/* Order Details Card */}
				<div className="bg-white shadow-lg rounded-lg p-6 border">
					<h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
						Order Details
					</h2>
					<ul className="text-gray-700 text-lg space-y-2">
						<li>
							<span className="font-semibold">Order ID:</span> {orderId}
						</li>
						<li>
							<span className="font-semibold">Customer Name:</span>{" "}
							{order.fname}
						</li>
						<li>
							<span className="font-semibold">Total Cost:</span> ₹
							{order.totalPrice}
						</li>
						<li>
							<span className="font-semibold">Order Date:</span>{" "}
							{formatDateIST(order.createdDate)}
						</li>
						<li>
							<span className="font-semibold">Address:</span> {order.address}
						</li>
					</ul>
				</div>

				{/* Products Section */}
				<h2 className="text-xl font-bold mt-6 mb-4 text-center text-gray-800">
					Ordered Products
				</h2>

				<div className="flex flex-row">
					{productsInOrder.map((product, index) => (
						<div
							key={product.productId}
							className="border shadow-md rounded-lg mx-4 my-4 bg-gray-50 hover:shadow-lg transition-all"
							style={{ width: "260px" }}
						>
							<p className="text-lg text-center py-1 font-semibold mb-2 bg-green-600 text-slate-100 w-full h-10 rounded-t-lg">
								Product - {index + 1}
							</p>

							<div className="p-4">
								<img
									src={product.imageURL}
									alt={product.name}
									className="w-full h-40 object-cover rounded-md mb-3"
								/>
								<h3 className="text-lg font-semibold text-gray-800">
									{product.name}
								</h3>
								<p className="text-gray-600">Quantity: {product.quantity}</p>
								<p className="text-green-700 font-bold mt-[1rem]">
									Total Price: ₹{product.totalPrice}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default OrderDetails;

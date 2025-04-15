"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { NEXT_PUBLIC_APP_API_URL} from "../../../../apiConfig";
import formatDateIST from "../../../../utils/formatDateIST";
import { imagePlaceHolder } from "../../../../utils/stringConstants";

const CustomerOrders = () => {
	const [orders, setOrders] = useState([]);
	const [groupedOrders, setGroupedOrders] = useState({});
	const userId = sessionStorage.getItem("userId");

	useEffect(() => {
		if (!userId) return;
		axios
			.get(`${NEXT_PUBLIC_APP_API_URL}api/orders/myPastOrders/${userId}`)
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
			<div className="max-w-5xl mx-auto p-6">
			<h1 className="text-2xl font-bold text-center mb-4 mt-8">
				My Orders
			</h1>
				{Object.keys(groupedOrders).length > 0 ? (
					Object.keys(groupedOrders).map((orderId) => {
						const totalOrderCost = groupedOrders[orderId].reduce(
							(acc, order) => acc + (Number(order.totalPrice)),
							0
						);
						return (
							<div
								key={orderId}
								className="border rounded-lg p-6 shadow-lg mb-6 bg-white"
							>
								<h2 className="text-xl font-semibold mb-2 text-gray-800">
									Order ID: {orderId}
								</h2>
								<p className="text-gray-600 text-sm mb-4">
									Order Date: {formatDateIST(groupedOrders[orderId][0].createdDate)}
								</p>
								<p className="text-green-700 font-bold text-lg">
									Total Order Cost: ₹{totalOrderCost}
								</p>
								<div className="flex flex-wrap gap-6">
									{groupedOrders[orderId].map((order) => (
										<div
											key={order.name}
											className="border rounded-lg p-4 shadow-md bg-gray-50 hover:shadow-lg transition-all"
											style={{ width: "250px"}} // Fixed Width & Height
										>
											<img
												src={order.imageURL ? order.imageURL : imagePlaceHolder}
												alt={order.name}
												className="w-[230px] h-[230px] object-cover rounded-md mb-3"
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
						);
					})
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
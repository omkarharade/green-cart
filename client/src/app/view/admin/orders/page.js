"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { NEXT_PUBLIC_APP_API_URL } from "../../../../apiConfig";
import formatDateIST from "../../../../utils/formatDateIST";
import Loader from "../../../../components/Loader";

const AdminOrderList = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch orders when component mounts
	useEffect(() => {
		axios
			.get(`${NEXT_PUBLIC_APP_API_URL}api/orders`)
			.then((res) => setOrders(res.data))
			.catch((err) => console.error("Couldn't receive order list", err))
			.finally(setLoading(false));
	}, []);

	// Group orders by orderId
	const groupedOrders = useMemo(() => {
		return orders.reduce((acc, order) => {
			if (!acc[order.orderId]) {
				acc[order.orderId] = [];
			}
			acc[order.orderId].push(order);
			return acc;
		}, {});
	}, [orders]);

	console.log("orders list === ", orders);

	return (
        <>
        <div className="max-w-6xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
				Admin Order List
			</h1>

			{loading ? (
				<Loader />
			) : (
				<div className="flex flex-wrap w-full">
					{Object.keys(groupedOrders).length > 0 ? (
						Object.keys(groupedOrders).map((orderId) => {
							const orders = groupedOrders[orderId];
							const customerName = orders[0].fname; // Get customer name once

							return (
								<div
									key={orderId}
									className="flex flex-col border rounded-lg shadow-lg bg-white hover:shadow-xl transition-all mx-4 my-4"
									style={{ width: "300px"}} // Fixed size for better visibility
								>
									{/* Order Info */}
									<h2 className="text-lg text-center py-1 font-semibold mb-2 bg-green-600 text-slate-100 w-full h-10 rounded-t-lg">
										Order {orderId}
									</h2>

									<div className=" flex flex-col p-4 w-full ">
										<p className="text-gray-600 text-sm">
											Date : {formatDateIST(orders[0].createdDate)}
										</p>
										<p className="text-gray-800 text-sm font-medium mb-3">
											Customer: {customerName}
										</p>

										<img
											src={"/images/orders.png"}
											alt={orders[0].name}
											className="w-[10rem] h-[10rem] object-cover rounded-md mb-2 self-center"
										/>
										<h3 className="text-md font-semibold text-gray-800">
											{orders[0].name}
										</h3>
										<p className="text-green-700 font-bold text-sm">
											Total: ₹{orders[0].totalPrice}
										</p>

										{/* View Details Button */}

										<Link
											href={{
												pathname: `/view/admin/orders/${orderId}`,
											}}
											className="mt-4 bg-blue-600 text-white text-center px-3 py-2 rounded-md w-full hover:bg-blue-700 transition"
										>
											View Details
										</Link>
									</div>
								</div>
							);
						})
					) : (
						<Loader />
					)}
				</div>
			)}
		</div>
        
        </>
	);
};

export default AdminOrderList;

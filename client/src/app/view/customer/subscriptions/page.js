"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { NEXT_PUBLIC_APP_API_URL } from "../../../../apiConfig";
import { imagePlaceHolder } from "../../../../utils/stringConstants";

const Subscriptions = () => {
	const subscriptionPlans = [
		{
			name: "Basic Box",
			description: "A simple and affordable option.",
			validity: "6 Months",
			recurringOrder: "One-time purchase",
			price: "₹999",
		},
		{
			name: "Deluxe Box",
			description: "A curated selection of premium products.",
			validity: "6 Months",
			recurringOrder: "Every 14 Days",
			price: "₹1999",
		},
		{
			name: "Family Box",
			description: "Essentials for the whole family.",
			validity: "6 Months",
			recurringOrder: "Every Month",
			price: "₹1499",
		},
	];

	const [addresses, setAddresses] = useState({});
	const [userId, setUserId] = useState(null);
	const [isReady, setIsReady] = useState(false);
	const [viewingProducts, setViewingProducts] = useState(false);
	const [products, setProducts] = useState([]);
	const [selectedPlanName, setSelectedPlanName] = useState("");
	const [userSubscriptionDetails, setUserSubscriptionDetails] = useState(null);
	const [loading, setLoading] = useState(true);

	const handleAddressChange = (planName, value) => {
		setAddresses((prev) => ({ ...prev, [planName]: value }));
	};

	const handleSubscribe = (planName) => {
		const userId = sessionStorage.getItem("userId");
		const address = addresses[planName];

		if (!userId) {
			alert("Please login to subscribe to a plan");
			return;
		}

		if (!address || address.trim() === "") {
			alert("Address is required");
			return;
		}

		axios
			.post(`${NEXT_PUBLIC_APP_API_URL}api/subscriptions`, {
				userId,
				planName,
				address,
			})
			.then(() => {
				alert(`Subscribed to ${planName}!`);
				setAddresses((prev) => ({ ...prev, [planName]: "" }));
				fetchUserSubscriptionDetails();
			})
			.catch((error) => {
				console.error("Error creating subscription:", error);
				alert("Error subscribing. Please try again.");
			});
	};

	const handleViewProducts = (planName) => {
		axios
			.get(`${NEXT_PUBLIC_APP_API_URL}api/subscriptions/${encodeURIComponent(planName)}`)
			.then((response) => {
				setProducts(response.data);
				setSelectedPlanName(planName);
				setViewingProducts(true);
			})
			.catch((error) => {
				console.error("Error fetching products:", error);
				alert("Failed to load products.");
			});
	};

	const handleCancelSubscription = (planName) => {
		axios
			.delete(`${NEXT_PUBLIC_APP_API_URL}api/subscriptions/cancel`, {
				data: { userId, planName },
			})
			.then(() => {
				alert("Subscription cancelled successfully!");
				fetchUserSubscriptionDetails();
			})
			.catch((error) => {
				console.error("Error cancelling subscription:", error);
				alert("Error cancelling subscription. Please try again.");
			});
	};

	const fetchUserSubscriptionDetails = () => {
		setLoading(true);
		if (userId) {
			Promise.all(
				subscriptionPlans.map((plan) =>
					axios
						.get(`${NEXT_PUBLIC_APP_API_URL}api/subscriptions/details/${userId}/${encodeURIComponent(plan.name)}`)
						.then((response) => ({ planName: plan.name, details: response.data }))
						.catch((error) => {
							if (error.response?.status === 404) {
								return { planName: plan.name, details: null };
							}
							console.error(`Error fetching subscription details for ${plan.name}:`, error);
							alert(`Error fetching subscription details for ${plan.name}. Please try again.`);
							return { planName: plan.name, details: null };
						})
				)
			)
				.then((allDetails) => {
					const detailsMap = allDetails.reduce((acc, { planName, details }) => {
						acc[planName] = details;
						return acc;
					}, {});
					setUserSubscriptionDetails(detailsMap);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = sessionStorage.getItem("userId");
			setUserId(storedUserId ? JSON.parse(storedUserId) : null);
			setIsReady(true);
		}
	}, []);

	useEffect(() => {
		if (isReady && userId) {
			fetchUserSubscriptionDetails();
		}
	}, [isReady, userId]);

	if (!isReady) return null;
	if (loading) return <div>Loading...</div>;

	if (viewingProducts) {
		return (
			<div className="bg-gray-100 min-h-screen p-6">
				<button
					onClick={() => setViewingProducts(false)}
					className="text-blue-600 hover:underline mb-4"
				>
					← Back to Subscriptions
				</button>
				<h2 className="text-2xl font-bold mb-6">
					Products in {selectedPlanName}
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((product) => (
						<div
							key={product.productId}
							className="bg-white p-4 rounded-lg shadow"
						>
							<img
								src={product.imageURL ? product.imageURL : imagePlaceHolder}
								alt={product.name}
								className="w-full h-[20rem] object-cover rounded"
							/>
							<h3 className="text-lg font-semibold mt-2">{product.name}</h3>
							<p className="text-gray-600 text-sm">{product.description}</p>
							<p className="text-green-600 font-bold">₹{product.price}</p>
							<p className="text-sm text-gray-500">
								Qty: {product.quantity || 1}
							</p>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-100 min-h-screen p-8">
			<h2 className="text-3xl font-bold mb-8 text-center">Subscription Plans</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{subscriptionPlans.map((plan) => {
					let planColor;
					switch (plan.name) {
						case "Basic Box":
							planColor = "bg-green-500";
							break;
						case "Deluxe Box":
							planColor = "bg-blue-500";
							break;
						case "Family Box":
							planColor = "bg-purple-500";
							break;
						default:
							planColor = "bg-gray-500";
					}

					const planDetails = userSubscriptionDetails?.[plan.name]?.data[0];
					const isSubscribed = !!planDetails;

                    console.log("userSubscriptonDetails ======", userSubscriptionDetails?.[plan.name]);
                    console.log("plan details > end  date  == ", planDetails);

					return (
						<div
							key={plan.name}
							className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative max-w-[30rem]"
						>
							<div
								className={`${planColor} w-full h-[10rem] rounded-t-lg flex items-center justify-center mb-6`}
							>
								<h3 className="text-xl font-semibold text-white">
									{plan.name}
								</h3>
							</div>

							<div className="space-y-4 mx-4">
								<p className="text-gray-600">{plan.description}</p>
								<p>
									<span className="font-medium">Validity:</span> {plan.validity}
								</p>
								<p>
									<span className="font-medium">Recurring Order:</span> {plan.recurringOrder}
								</p>
								<p className="text-lg font-bold text-green-600">{plan.price}</p>

								{isSubscribed ? (
									<div className="space-y-2">
                                    <p>
                                        End Date: {planDetails.end_date 
                                            ? moment(planDetails.end_date).format("MMMM D, YYYY h:mm A") 
                                            : "NA"}
                                    </p>
                                    <p>
                                        Next Order Date: {planDetails.next_order_date 
                                            ? moment(planDetails.next_order_date).format("MMMM D, YYYY h:mm A") 
                                            : "NA"}
                                    </p>
                                    <p>
                                        Delivery Address: {planDetails.delivery_address}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCancelSubscription(plan.name)}
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition w-full"
                                        >
                                            Cancel Subscription
                                        </button>
                                        <button
                                            onClick={() => handleViewProducts(plan.name)}
                                            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition w-full"
                                        >
                                            View Products
                                        </button>
                                    </div>
                                </div>                             
                                
								) : (
									<>
										<input
											type="text"
											placeholder="Enter your address"
											className="w-full border border-gray-300 rounded px-3 py-2"
											value={addresses[plan.name] || ""}
											onChange={(e) => handleAddressChange(plan.name, e.target.value)}
										/>
										<div className="flex gap-2">
											<button
												onClick={() => handleSubscribe(plan.name)}
												className={`${planColor} text-white py-2 px-4 rounded-lg hover:opacity-90 transition w-full`}
											>
												Subscribe
											</button>
											<button
												onClick={() => handleViewProducts(plan.name)}
												className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition w-full"
											>
												View Products
											</button>
										</div>
									</>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Subscriptions;

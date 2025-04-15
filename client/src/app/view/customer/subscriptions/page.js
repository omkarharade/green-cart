"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { NEXT_PUBLIC_APP_API_URL } from "../../../../apiConfig";

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
                userId: userId,
                planName,
                address,
            })
            .then((response) => {
                console.log("Subscription created:", response.data);
                alert(`Subscribed to ${planName}!`);
                setAddresses((prev) => ({ ...prev, [planName]: "" })); // Clear address
            })
            .catch((error) => {
                console.error("Error creating subscription:", error);
                alert("Error subscribing. Please try again.");
            });
    };

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = sessionStorage.getItem("userId");
			setUserId(storedUserId ? JSON.parse(storedUserId) : null);
			setIsReady(true);
		}
	}, []);

	useEffect(() => {
		if (!isReady) return;
	}, [isReady, userId]);

	return (
		<div className="bg-gray-100 min-h-screen p-8">
			<h2 className="text-3xl font-bold mb-8 text-center">
				Subscription Plans
			</h2>

			{userId ? (
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

						return (
							<div
								key={plan.name}
								className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
							>
								<div
									className={`${planColor} w-full h-16 rounded-t-lg flex items-center justify-center mb-[2rem]`}
								>
									<h3 className="text-xl font-semibold text-white">
										{plan.name}
									</h3>
								</div>

								<div className="space-y-4 mt-4 mx-[3rem]">
									<p className="text-gray-600">{plan.description}</p>
									<p>
										<span className="font-medium">Validity:</span>{" "}
										{plan.validity}
									</p>
									<p>
										<span className="font-medium">Recurring Order:</span>{" "}
										{plan.recurringOrder}
									</p>
									<p className="text-lg font-bold text-green-600">
										{plan.price}
									</p>

									<input
										type="text"
										placeholder="Enter your address"
										className="w-full border border-gray-300 rounded px-3 py-2"
										value={addresses[plan.name] || ""}
										onChange={(e) =>
											handleAddressChange(plan.name, e.target.value)
										}
									/>

									<button
										onClick={() => handleSubscribe(plan.name)}
										className={`${planColor} text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 w-full max-w-[10rem]`}
									>
										Subscribe
									</button>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Subscriptions;

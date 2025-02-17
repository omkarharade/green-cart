"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../../../../apiConfig";
import CartItem from "./cartItem";
import { useRouter } from "next/navigation";

const ShoppingCart = (props) => {
	const [cartProducts, setCartProducts] = useState([]);
	const userId = sessionStorage.getItem("userId");
	const [address, setAddress] = useState("");
	const [totalCost, setTotalCost] = useState(0.0);
	const router = useRouter();

	useEffect(() => {
		fetchCartItems();
	}, []);

  useEffect(() => {
    const total = cartProducts.reduce((acc, product) => {
      const price = Number(product.price);
      // If product.quantity doesn't exist, assume 1
      const quantity = product.quantity ? Number(product.quantity) : 1;
      return acc + price * quantity;
    }, 0);
    setTotalCost(total);
  }, [cartProducts]);

	const updateAddress = (updatedAddress) => {
		setAddress(updatedAddress);
	};

  const updateTotalCost = () => {

    const total = cartProducts.reduce(
      (acc, product) => acc + (Number(product.price) * Number(product.quantity)),
      0
    );
    setTotalCost(total);

  }

	const fetchCartItems = async () => {
		await axios
			.get(`${getBaseURL()}api/cart/${userId}`)
			.then((res) => {
				setCartProducts(res.data);
			})
			.catch((err) => console.log("Error occurred"));
	};

	const buyProducts = () => {
		// Retrieve JWT token from session storage
		const token = sessionStorage.getItem("jwt_token");

		if (!token) {
			// Handle case where token is not available
			alert("Authorization token is missing");
			return;
		}

		if (address !== "") {
			let customerPayload = { address };

			// Include JWT token in the headers
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			axios
				.post(
					`${getBaseURL()}api/cart/buy/${userId}`,
					{ ...customerPayload },
					config
				)
				.then((res) => {
					setCartProducts([]);
					setAddress("");
					alert("Order placed successfully");
				})
				.catch((error) => {
					if (error.response && error.response.status === 401) {
						// Unauthorized - token might be expired or invalid
						alert("Authorization failed. Please log in again.");
						// Handle logout or redirect to login page
					} else {
						// Other error handling
						console.error("Error:", error);
					}
				});
		} else {
			alert("Please enter your address");
		}
	};

	const removeProduct = (productId) => {
		axios
			.delete(`${getBaseURL()}api/cart/remove/${productId}/${userId}`)
			.then((res) => {
				console.log("Deleted successfully");
				let updatedCartList = cartProducts.filter((product) => {
					return product.productId !== productId;
				});
				setCartProducts(updatedCartList);
			})
			.catch((err) => {
				console.log("Error occurred");
			});
	};

	const handleContinueShopping = () => {
		router.push("/view/customer");
	};

	return (
		<div>

			<div className="p-6">
				<h1 className="text-2xl font-bold text-center mb-4">Shopping Cart</h1>

				<div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
					{cartProducts?.length > 0 ? (
						<>
							{/* Cart Items Container */}
							<div className="space-y-4">
								{cartProducts.map((product) => (
									<CartItem
										key={product.productId}
										product={product}
										removeProduct={removeProduct}
									/>
								))}
							</div>

							{/* Display Total Cost */}
							<div className="mt-4 mx-2 text-right">
								<p className="text-xl font-bold">
									Total: ₹{totalCost.toFixed(2)}
								</p>
							</div>

							{/* Address Input and Buy Button */}
							<div className="mt-[5rem] flex flex-col sm:flex-row gap-4 ">
								<input
									type="text"
									className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
									placeholder="Enter Address"
									value={address}
									onChange={(e) => updateAddress(e.target.value)}
								/>
								<button
									className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
									onClick={buyProducts}
								>
									Buy
								</button>
							</div>
						</>
					) : (
						<div className="text-center">
							<h1 className="text-2xl font-semibold text-gray-800 mb-4">
								Cart is Empty
							</h1>
						</div>
					)}

					{/* Continue Shopping Button */}
					<div className="my-[6rem] text-center">
						<button
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
							onClick={handleContinueShopping} // Replace with your navigation logic
						>
							Continue Shopping
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShoppingCart;

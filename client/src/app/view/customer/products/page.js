// components/Products.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { NEXT_PUBLIC_APP_API_URL } from "../../../../apiConfig";
import {imagePlaceHolder} from "../../../../utils/stringConstants"

const categories = [
	"All",
	"cleaning supplies",
	"personal care",
	"kitchen essentials",
	"wellness",
	"lifestyle",
];

const ProductCard = ({ product, updateProductQuantity, addToCart }) => {
	const [quantity, setQuantity] = useState(product.quantity || 0);
	const [buttonText, setButtonText] = useState("Add to Cart"); // State for button text

	const handleIncrease = () => {
		const newQuantity = quantity + 1;
		setQuantity(newQuantity);
		updateProductQuantity(
			{ target: { value: newQuantity } },
			product.productId
		);
	};

	const handleDecrease = () => {
		if (quantity > 0) {
			const newQuantity = quantity - 1;
			setQuantity(newQuantity);
			updateProductQuantity(
				{ target: { value: newQuantity } },
				product.productId
			);
		}
	};

	const handleAddToCart = () => {

		addToCart(product);
		setButtonText("Added"); // Change the button text to "Added"

		console.log("Adding product:", product);

		setTimeout(() => {
			setQuantity(0); // Reset the quantity to 0 after adding to cart
			setButtonText("Add to Cart"); // Revert the button text after 2 seconds
		}, 2000);
	};

	// Button disabled if quantity is 0
	const isButtonDisabled = quantity === 0;

	return (
		<div className="border rounded-lg shadow-lg p-4 bg-white flex flex-col items-center justify-between w-[270px] mx-5 my-5">
			{/* Product Image */}
			<img
				src={product.imageURL? product.imageURL : imagePlaceHolder}
				alt={product.name}
				className="w-[250px] h-[250px] object-cover rounded-md"
			/>

			{/* Product Name */}
			<h3 className="text-lg font-semibold mt-2">{product.name}</h3>

			{/* Product Price */}
			<p className="text-green-700 font-bold text-lg">₹{product.price}</p>

			{/* Quantity Control */}
			<div className="flex items-center space-x-3 mt-2">
				{/* Decrease Button */}
				<button
					className="bg-red-500 text-white px-3 py-1 rounded-xl text-lg font-bold transition-all duration-200 hover:bg-red-600 shadow-md"
					onClick={handleDecrease}
				>
					−
				</button>

				{/* Read-Only Quantity Input */}
				<input
					type="number"
					value={quantity}
					readOnly
					className="w-14 text-center bg-gray-100 outline-none border border-gray-300 px-2 py-1 text-lg font-semibold rounded-md"
				/>

				{/* Increase Button */}
				<button
					className="bg-green-500 text-white px-3 py-1 rounded-xl text-lg font-bold transition-all duration-200 hover:bg-green-600 shadow-md"
					onClick={handleIncrease}
				>
					+
				</button>
			</div>

			{/* Add to Cart Button */}
			<button
				className={`${
					isButtonDisabled
						? "bg-blue-200 cursor-not-allowed"
						: "bg-blue-500 hover:bg-blue-600"
				} text-white px-4 py-2 mt-3 rounded-md w-full transition-all duration-200 shadow-md`}
				onClick={handleAddToCart}
				disabled={isButtonDisabled} // Disable button if quantity is 0
			>
				{buttonText}
			</button>
		</div>
	);
};

const Products = () => {

    const [productList, setProductList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cartProducts, setCartProducts] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [userId, setUserId] = useState(null);

    const addToCart = (product) => {
		if (product.quantity > 0) {
			let updatedCartList = [...cartProducts];
			let existingProductIndex = updatedCartList.findIndex(
				(p) => p.productId === product.productId
			);

			if (existingProductIndex !== -1) {
				updatedCartList[existingProductIndex].quantity += product.quantity;
			} else {
				updatedCartList.push({ ...product });
			}

			axios
				.post(`${NEXT_PUBLIC_APP_API_URL}api/cart/add`, {
					userId: userId,
					productId: product.productId,
					quantity: product.quantity,
					isPresent: existingProductIndex !== -1,
				})
				.then(() => {
					setCartProducts(updatedCartList);
				})
				.catch((error) => console.log("Error adding to cart:"));
		}
	};

	const updateProductQuantity = (e, productId) => {
		const updatedList = productList.map((product) => 
			product.productId === productId ? { ...product, quantity: parseInt(e.target.value) || 0 } : product
		);
		setProductList(updatedList);
	};

    const fetchProducts = (category) => {
		let url = `${NEXT_PUBLIC_APP_API_URL}api/products`;
		if (category && category !== "All") {
			url = `${NEXT_PUBLIC_APP_API_URL}api/products/${category}`;
		}

		axios
			.get(url)
			.then((res) => {
				setProductList(res.data);
				res.data.forEach((product) => {
					product.quantity = 0;
				});
			})
			.catch((err) => console.log("Error fetching products"));
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
		fetchProducts(selectedCategory);
	}, [isReady, userId, selectedCategory]);



	return (
		<div className="mt-[3rem] flex flex-col">
			<h1 className="text-2xl font-bold text-center mb-4 mt-8">
				All Products List
			</h1>

			{/* Category Filter Dropdown */}
			<div className="flex justify-center mt-6">
				<div className="relative w-72">
					<select
						className="appearance-none border border-gray-300 py-3 px-6 w-full rounded-2xl focus:ring-2 focus:ring-green-500 bg-white shadow-md text-gray-700 font-medium cursor-pointer transition-all duration-300 hover:border-green-500 hover:shadow-lg"
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
					>
						{categories.map((category, index) => (
							<option key={index} value={category}>
								{category.charAt(0).toUpperCase() + category.slice(1)}
							</option>
						))}
					</select>
					{/* Custom dropdown arrow */}
					<div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5 text-gray-500"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>

			{/* Product Grid */}
			<div className="p-6">
				{productList.length > 0 ? (
					<div className="flex justify-center flex-wrap gap-4">
						{productList.map((product) => (
							<ProductCard
								key={product.productId}
								product={product}
								updateProductQuantity={updateProductQuantity}
								addToCart={addToCart}
							/>
						))}
					</div>
				) : (
					<p className="text-center text-gray-500">No products available.</p>
				)}
			</div>
		</div>
	);
};

export default Products;

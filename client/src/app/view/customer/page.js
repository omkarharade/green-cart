"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../../../apiConfig";

const Slider = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const totalSlides = 3;

	const showSlide = (index) => {
		if (index >= totalSlides) setCurrentIndex(0);
		else if (index < 0) setCurrentIndex(totalSlides - 1);
		else setCurrentIndex(index);
	};

	const slides = [
		{
			src: "slide1.jpg",
			text: "Sustainable Living is Easy",
			button: "SHOP SUSTAINABLE →",
		},
		{
			src: "slide2.jpg",
			text: "Choose Planet Over Plastic",
			button: "SHOP BETTER →",
		},
		{
			src: "slide3.jpg",
			text: "Green Living Solutions",
			button: "EXPLORE NOW →",
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative w-full overflow-hidden">
			<div
				className="flex h-fit  transition-transform duration-700 ease-in-out"
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}
			>
				{slides.map((slide, i) => (
					<div key={i} className="w-full h-full flex-shrink-0 relative">
						<img
							src={`/images/${slide.src}`}
							alt={`Slide ${i + 1}`}
							className="w-full h-full object-cover"
						/>
						{i === currentIndex && ( // Only render text for the active slide
							<div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-50">
								<h2 className="text-3xl font-bold mb-2">{slide.text}</h2>
								<button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg">
									{slide.button}
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const ProductCard = ({ product, updateProductQuantity, addToCart }) => {
	const [quantity, setQuantity] = useState(product.quantity || 0);

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

	return (
		<div className="border rounded-lg shadow-lg p-4 bg-white flex flex-col items-center justify-between h-[420px] w-[270px] mx-5 my-5">
			{/* Product Image */}
			<img
				src={product.imageURL}
				alt={product.name}
				className="w-full h-40 object-cover rounded-md"
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
				className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-md w-full transition-all duration-200 hover:bg-blue-600 shadow-md"
				onClick={() => addToCart(product)}
			>
				Add to Cart
			</button>
		</div>
	);
};

const Customer = () => {
	const [productList, setProductList] = useState([]);
	const [cartProducts, setCartProducts] = useState([]);
	const [userId, setUserId] = useState(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = sessionStorage.getItem("userId");
			setUserId(storedUserId ? JSON.parse(storedUserId) : null);
			setIsReady(true);
		}
	}, []);

	useEffect(() => {
		if (!isReady) {
			console.log("userId is null");
			return;
		}

		axios
			.get(`${getBaseURL()}api/products`)
			.then((res) => {
				setProductList(res.data);
				res.data.forEach((product) => {
					product.quantity = 0;
				});
				axios
					.get(`${getBaseURL()}api/cart/${userId}`)
					.then((responseCart) => {
						let productsInCart = responseCart.data;
						setCartProducts(productsInCart);
					})
					.catch((err) => console.log("Error occurred"));
			})
			.catch((err) => console.log("Error"));
	}, [isReady, userId]);

	const fetchProducts = () => {
		axios
			.get(`${getBaseURL()}api/products`)
			.then((res) => {
				const data = res.data;
				setProductList(data);
			})
			.catch((err) => console.log("Couldn't receive list"));
	};

	// Function to add products to cart
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
				.post(`${getBaseURL()}api/cart/add`, {
					userId: userId,
					productId: product.productId,
					quantity: product.quantity,
					isPresent: existingProductIndex !== -1,
				})
				.then(() => {
					setCartProducts(updatedCartList);
					const updatedProductList = productList.map((p) => ({
						...p,
						quantity: 0,
					}));
					setProductList(updatedProductList);

					fetchProducts();
				})
				.catch((error) => console.log("Error adding to cart:", error));
		}
	};

	// Function to remove products from cart
	const removeProduct = (productId) => {
		axios
			.delete(`${getBaseURL()}api/cart/remove/${productId}/${userId}`)
			.then(() => {
				console.log("Deleted successfully");
				setCartProducts(
					cartProducts.filter((product) => product.productId !== productId)
				);
			})
			.catch(() => console.log("Error occurred while removing product"));
	};

	// Function to update product quantity
	const updateProductQuantity = (e, productId) => {
		const updatedList = productList.map((product) => {
			if (product.productId === productId) {
				return { ...product, quantity: parseInt(e.target.value) || 0 };
			}
			return product;
		});
		setProductList(updatedList);
	};

	return (
		<div className="font-sans w-full">
			{userId ? (
				<div>
					{/* Image Slider */}
					<Slider />

					{/* Product Sections */}

					<div className="p-6">
						<h1 className="text-2xl font-bold text-center mb-4">Products</h1>

						{productList ? (
							<div className="flex flex-wrap justify-center gap-4">
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
							<Loader/>
						)}
					</div>

					{/* Footer */}
					<div className="bg-green-700 text-white text-center p-4 mt-6">
						<div className="flex justify-center space-x-4 mb-2">
							{[
								"Shop All",
								"Care",
								"Cleaning",
								"Essentials",
								"Home & Living",
								"Work",
								"Travel",
								"Gift",
								"Sale",
								"Contact",
							].map((link, index) => (
								<a key={index} href="#" className="hover:underline">
									{link}
								</a>
							))}
						</div>
						<p>&copy; 2025 GreenLiving. All rights reserved.</p>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Customer;

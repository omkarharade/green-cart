"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { NEXT_PUBLIC_APP_API_URL } from "../../../apiConfig";

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
				src={product.imageURL}
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

const categories = [
	"All", // Default option to fetch all products
	"cleaning supplies",
	"personal care",
	"kitchen essentials",
	"wellness",
	"lifestyle",
];

const Customer = () => {
	const [productList, setProductList] = useState([]);
	const [cartProducts, setCartProducts] = useState([]);
	const [userId, setUserId] = useState(null);
	const [isReady, setIsReady] = useState(false);
	const [topPicks, setTopPicks] = useState([]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = sessionStorage.getItem("userId");
			setUserId(storedUserId ? JSON.parse(storedUserId) : null);
			setIsReady(true);
		}
	}, []);

	useEffect(() => {
		if (!isReady) return;
		fetchTopPicks();
	}, [isReady, userId]);

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
	
		const updatedTopPicks = { ...topPicks };
		Object.keys(updatedTopPicks).forEach(category => {
			updatedTopPicks[category] = updatedTopPicks[category].map(product =>
				product.productId === productId ? { ...product, quantity: parseInt(e.target.value) || 0 } : product
			);
		});
		setTopPicks(updatedTopPicks);
	};
	const fetchTopPicks = () => {
		axios
			.get("http://localhost:3001/api/products/get-top-picks")
			.then((res) => {
				const groupedProducts = res.data.reduce((acc, product) => {
					if (!acc[product.category]) acc[product.category] = [];
					acc[product.category].push(product);
					return acc;
				}, {});
				setTopPicks(groupedProducts); // Store grouped products
			})
			.catch((err) => console.log("Error fetching top picks"));
	};

	return (
		<div className="font-sans w-full">
			{userId ? (
				<div>
					<Slider />

					{topPicks && Object.keys(topPicks).length > 0 && (
						<h1 className="text-2xl font-bold text-center mb-4 mt-8">
							Top Picks
						</h1>
					)}
					{topPicks && Object.keys(topPicks).length > 0 ? (
						<div className="flex flex-col items-center justify-self-center max-w-[100rem]">
							{Object.keys(topPicks).map((category) => (
								<div key={category} className="mb-6 mx-8">
									<h3 className="text-xl font-semibold mb-2">{category}</h3>
									<div className="flex flex-wrap gap-4">
										{topPicks[category].map((product) => (
											<ProductCard
												key={product.productId}
												product={product}
												updateProductQuantity={updateProductQuantity}
												addToCart={addToCart}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-center text-gray-500">No top picks available.</p>
					)}

					{/* Footer */}
					<div className="bg-green-700 text-white text-center p-4 mt-6">
						<p>&copy; 2025 GreenLiving. All rights reserved.</p>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Customer;

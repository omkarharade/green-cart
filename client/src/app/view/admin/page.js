"use client";

import { React, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { getBaseURL } from "../../../apiConfig";
import { useRouter, redirect } from "next/navigation";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const navLinks = [
		{ name: "products", route: "/view/admin" },
		{ name: "add product", route: "/view/admin/add-product" },
		{ name: "check orders", route: "/view/admin" },
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

const ProductCard = ({
	productId,
	name,
	price,
	description,
	imageURL,
	onDelete,
}) => {
	const [showDescription, setShowDescription] = useState(false);

	return (
		<div className="border rounded-lg shadow-lg p-4 bg-white flex flex-col items-center justify-between h-[400px] w-[250px] mx-5 my-5">
			{showDescription ? (
				// Description View
				<>
					<div className="border-2 border-blue-500 w-full h-full flex items-center justify-center p-4 rounded-md overflow-hidden">
						<p className="text-blue-500 text-sm text-center overflow-y-auto max-h-[300px] p-2">
							{description}
						</p>
					</div>
					<button
						className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md w-full"
						onClick={() => setShowDescription(false)}
					>
						Close Description
					</button>
				</>
			) : (
				// Default Product View
				<>
					<img
						src={imageURL}
						alt={name}
						className="w-full h-40 object-cover rounded-md"
					/>
					<h3 className="text-lg font-semibold mt-2">{name}</h3>
					<p className="text-green-700 font-bold">₹{price}</p>

					{/* See Description Button */}
					<button
						className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md w-full"
						onClick={() => setShowDescription(true)}
					>
						See Description
					</button>

					{/* Delete Button */}
					<button
						className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md w-full flex items-center justify-center gap-2"
						onClick={onDelete}
					>
						<Trash2 size={20} /> Delete
					</button>
				</>
			)}
		</div>
	);
};

function Admin() {
	const [products, setProducts] = useState([]);
	const router = useRouter();

	useEffect(() => {
		fetchProducts();
	}, []);

	const deleteProduct = (productId) => {
		axios
			.delete(`${getBaseURL()}api/products/delete/${productId}`)
			.then((res) => {
				console.log("Deletion successful");
				fetchProducts();
			})
			.catch((err) => console.log("Error"));
	};

	const fetchProducts = () => {
		axios
			.get(`${getBaseURL()}api/products`)
			.then((res) => {
				const data = res.data;
				setProducts(data);
			})
			.catch((err) => console.log("Couldn't receive list"));
	};

	console.log("products", products);

	return (
		<div>
			{/* navbar */}
			<Navbar />

			{/* product list  */}
			<div className="flex flex-wrap">
				{products.map((product, index) => (
					<ProductCard
						key={index}
						{...product}
						onDelete={() => deleteProduct(product.productId)}
					/>
				))}
			</div>
		</div>
	);
}

export default Admin;

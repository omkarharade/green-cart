"use client";

import { React, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { NEXT_PUBLIC_APP_API_URL } from "../../../apiConfig";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";

const ProductCard = ({ product, onDelete }) => {
	const [showDescription, setShowDescription] = useState(false);

	return (
		<div className="border rounded-lg shadow-lg p-4 bg-white flex flex-col items-center justify-between w-[250px] mx-5 my-5">
			{showDescription ? (
				<>
					<div className="border-2 border-blue-500 w-full h-full flex items-center justify-center p-4 rounded-md overflow-hidden">
						<p className="text-blue-500 text-sm text-center overflow-y-auto h-[300px] p-2">
							{product.description}
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
				<>
					<img
						src={product.imageURL}
						alt={product.name}
						className="w-[230px] h-[230px] object-cover rounded-md"
					/>
					<h3 className="text-lg font-semibold mt-2">{product.name}</h3>
					<p className="text-green-700 font-bold">₹{product.price}</p>

					<button
						className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md w-full"
						onClick={() => setShowDescription(true)}
					>
						See Description
					</button>

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
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = () => {
		setLoading(true);
		axios
			.get(`${NEXT_PUBLIC_APP_API_URL}api/products`)
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => console.log("Couldn't receive list"))
			.finally(() => setLoading(false));
	};

	const deleteProduct = (productId) => {
		axios
			.delete(`${NEXT_PUBLIC_APP_API_URL}api/products/delete/${productId}`)
			.then(() => {
				console.log("Product deleted successfully");
				fetchProducts();
			})
			.catch((err) => console.log("Error deleting product:", err));
	};

	// Group products by category
	const groupedProducts = products.reduce((acc, product) => {
		const category = product.category || "Uncategorized"; // Default category
		if (!acc[category]) acc[category] = [];
		acc[category].push(product);
		return acc;
	}, {});

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
				All Products
			</h1>

			{loading ? (
				<Loader />
			) : (
				Object.keys(groupedProducts).map((category, index) => (
					<div key={index} className="mb-8">
						<h2 className="text-xl font-semibold text-gray-700 mt-4 border-b-2 border-gray-300 pb-2">
							{category}
						</h2>
						<div className="flex flex-wrap">
							{groupedProducts[category].map((product) => (
								<ProductCard
									key={product.productId}
									product={product}
									onDelete={() => deleteProduct(product.productId)}
								/>
							))}
						</div>
					</div>
				))
			)}
		</div>
	);
}

export default Admin;

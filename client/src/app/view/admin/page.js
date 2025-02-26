"use client";

import { React, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { NEXT_PUBLIC_APP_API_URL } from "../../../apiConfig";
import { useRouter, redirect } from "next/navigation";
import Loader from "../../../components/Loader";

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
		<div className="border rounded-lg shadow-lg p-4 bg-white flex flex-col items-center justify-between w-[250px] mx-5 my-5">
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
						className="w-[230px] h-[230px] object-cover rounded-md"
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
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProducts();
	}, []);

	const deleteProduct = (productId) => {
		console.log("delete function called")
		axios
			.delete(`${NEXT_PUBLIC_APP_API_URL}api/products/delete/${productId}`)
			.then((res) => {
				console.log("Deletion successful");
				fetchProducts();
			})
			.catch((err) => console.log("Error"));
	};

	const fetchProducts = () => {
		setLoading(true);
		axios
			.get(`${NEXT_PUBLIC_APP_API_URL}api/products`)
			.then((res) => {
				const data = res.data;
				setProducts(data);
			})
			.catch((err) => console.log("Couldn't receive list"))
			.finally(setLoading(false));
	};

	console.log("products", products);

	return (
		<>
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
					All Products
				</h1>
				{/* product list  */}

				{loading ? (
					<Loader />
				) : (
					<div className="flex flex-wrap">
						{products.map((product, index) => (
							<ProductCard
								key={index}
								{...product}
								onDelete={() => deleteProduct(product.productId)}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
}

export default Admin;

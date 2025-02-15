"use client";

import { useState } from "react";
import axios from "axios";
import { getBaseURL } from "../../../../apiConfig";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        {name: "products", route: "/view/admin"},
        {name:"add product", route: "/view/admin/add-product"},
    {name: "check orders", route: "/view/admin"}
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


const AddProductForm = () => {
	const [productName, setProductName] = useState("");
	const [productPrice, setProductPrice] = useState("");
	const [productDesc, setProductDesc] = useState("");
	const [productImageURL, setProductImageURL] = useState("");
	const [error, setError] = useState("");

	const router = useRouter();

	const addProduct = () => {
		let name = productName;
		let price = parseFloat(productPrice);
		let description = productDesc;
		let imageURL = productImageURL;

		if (name !== "" && price > 0 && description !== "" && imageURL !== "") {
			console.log("name == ", name);
			console.log("price == ", price);
			console.log("description == ", description);
			console.log("imageURL == ", imageURL);

			axios
				.post(`${getBaseURL()}api/products/create`, {
					name,
					price,
					description,
					imageURL,
				})
				.then((res) => {
					console.log("Product added");
					resetForm();
					router.push("/view");
				})
				.catch((err) => {
					console.log(
						"Product cannot be added, missing details or some error occurred"
					);
					console.log("error : ", err);
				});
		} else {
			setError("All fields are required and price must be greater than 0.");
		}
	};

	const resetForm = () => {
		setProductName("");
		setProductPrice("");
		setProductDesc("");
		setProductImageURL("");
		setError("");
	};

	return (
		<div>
			{/* navbar */}
			<Navbar />

			{/* add product  */}
			<div className="h-screen flex justify-center items-center bg-gray-100">
				<div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
					<h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
						Add New Product
					</h2>

					{error && (
						<p className="text-red-600 text-sm text-center mb-4">{error}</p>
					)}

					<div className="flex flex-col space-y-4">
						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Product Name:
							</label>
							<input
								type="text"
								className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
								value={productName}
								onChange={(e) => setProductName(e.target.value)}
								placeholder="Enter product name"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Price:
							</label>
							<input
								type="number"
								className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
								value={productPrice}
								onChange={(e) => setProductPrice(e.target.value)}
								placeholder="Enter price"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Description:
							</label>
							<textarea
								className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none resize-none h-24"
								value={productDesc}
								onChange={(e) => setProductDesc(e.target.value)}
								placeholder="Enter product description"
							></textarea>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Image URL:
							</label>
							<input
								type="text"
								className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
								value={productImageURL}
								onChange={(e) => setProductImageURL(e.target.value)}
								placeholder="Enter image URL"
							/>
						</div>

						{/* Image Preview Section */}
						{productImageURL && (
							<div className="flex justify-center">
								<img
									src={productImageURL}
									alt="Preview"
									className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-md"
									onError={(e) => (e.target.style.display = "none")} // Hide if the URL is invalid
								/>
							</div>
						)}

						<button
							onClick={addProduct}
							className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
						>
							Add Product
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProductForm;

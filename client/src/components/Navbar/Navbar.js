"use client";

import { Dancing_Script } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, User, ShoppingCart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation"; // Use router for redirecting after logout
import { LogOut } from "lucide-react";
import Loader from "../Loader";

const dancingScript = Dancing_Script({
	subsets: ["latin"],
	weight: ["400", "700"],
});

const Navbar = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false); // Controls the user dropdown menu
	const [isAdmin, setIsAdmin] = useState(false);
	const pathname = usePathname(); // Get the current pathname
	const [isAuthentic, setIsAuthentic] = useState(false);

	// Effect to read authentication data from sessionStorage and update state
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedAdmin = sessionStorage.getItem("isAdmin");
			const storedIsAuthentic = sessionStorage.getItem("isUserAuthenticated");
			setIsAdmin(storedAdmin ? JSON.parse(storedAdmin) : false);
			setIsAuthentic(storedIsAuthentic ? JSON.parse(storedIsAuthentic) : false);
		}
	}, []);

	// Handle Logout
	const handleLogout = () => {
		sessionStorage.removeItem("isUserAuthenticated");
		sessionStorage.removeItem("userId");
		sessionStorage.removeItem("isAdmin");
		sessionStorage.removeItem("jwt_token");
		sessionStorage.removeItem("jwt_refresh_token");
		setIsAdmin(false);
		setIsAuthentic(false);
		router.push("/login"); // Redirect to login page after logout
	};

	const adminNavLinks = [
		{ name: "Products", route: "/view/admin" },
		{ name: "Add Product", route: "/view/admin/add-product" },
		{ name: "Check Orders", route: "/view/admin/orders" },
	];

	const customerNavLinks = [
		{ name: "Home", route: "/view/customer" },
		{name: "Products", route: "/view/customer/products"},
		{ name: "Past Orders", route: "/view/customer/orders" },
	];

	// Only show Navbar on non-login/signup pages
	if ((pathname === "/login" || pathname === "/register") && !isAuthentic) {
		return null; // Don't show navbar on login or register page
	}

	return (
		<nav className={`bg-green-700 p-4 text-white ${dancingScript.className}`}>
			<div className="flex flex-row justify-between items-center">
				{/* Logo */}
				<div className="text-4xl font-bold">GreenLiving</div>

				{/* Navigation Links - Hidden on Mobile */}
				<div className="hidden md:flex md:space-x-8 lg:space-x-12">
					{(isAdmin ? adminNavLinks : customerNavLinks).map((link, index) => (
						<Link
							key={index}
							href={link.route}
							className="hidden md:flex font-bold text-2xl"
						>
							{link.name}
						</Link>
					))}
				</div>

				<div className="flex flex-row">
					{/* Right Section - Search & Icons */}
					<div className="flex items-center space-x-4">
						{/* Cart Icon - Only for Customers */}
						{!isAdmin && (
							<Link href="/view/customer/cart" className="hidden md:block">
								<div className="h-10 w-10 flex items-center justify-center border rounded-full border-gray-100 hover:bg-gray-100 cursor-pointer">
									<ShoppingCart className="h-5 w-5 text-white hover:text-green-700" />
								</div>
							</Link>
						)}

						{/* Search Bar with Search Icon on the right */}
						<div className="relative">
							<input
								type="text"
								placeholder="Search..."
								className="p-2 pr-10 rounded border border-gray-300 text-black"
							/>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
								<Search className="h-5 w-5 text-gray-600" />
							</div>
						</div>

						{/* User Icon with Clickable Dropdown */}
						<div className="relative">
							<div
								className="h-10 w-10 flex items-center justify-center border rounded-full border-gray-100 hover:bg-gray-100 cursor-pointer"
								onClick={() => setShowUserMenu(!showUserMenu)}
							>
								<User className="h-5 w-5 text-white hover:text-green-700" />
							</div>

							{/* User Dropdown Menu */}
							{showUserMenu && (
								<div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-2 z-50">
									{isAuthentic ? (
										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-sans rounded-md hover:bg-red-600 transition"
										>
											<LogOut className="h-5 w-5" /> Logout
										</button>
									) : (
										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-sans rounded-md hover:bg-green-700 transition"
										>
											<LogOut className="h-5 w-5" /> Login
										</button>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Mobile Menu (Shown when isOpen is true) */}
					<button
						className="md:hidden text-white text-2xl ms-4"
						onClick={() => setIsOpen(!isOpen)}
					>
						☰
					</button>
				</div>
			</div>

			{/* Mobile Menu (Shown when isOpen is true) */}

			{isOpen && (
				<div className="md:hidden flex flex-col space-y-2 mt-4 bg-green-800 p-4 rounded">
					{(isAdmin ? adminNavLinks : customerNavLinks).map((link, index) => (
						<Link
							key={index}
							href={link.route}
							className="block hover:underline font-bold text-lg"
							onClick={() => setIsOpen(!isOpen)}
						>
							{link.name}
						</Link>
					))}

					{!isAdmin && (
						<Link
							href={"/view/customer/cart"}
							className="block hover:underline font-bold text-lg"
							onClick={() => setIsOpen(!isOpen)}
						>
							{"Cart"}
						</Link>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;

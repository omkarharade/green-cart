"use client"

import { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 p-4 text-white">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">GreenLiving</div>

        {/* Hamburger Icon for Mobile */}
        <button 
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Navigation Links - Hidden on Mobile */}
        <div className="hidden md:flex space-x-4">
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
      </div>

      {/* Mobile Menu (Shown when isOpen is true) */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-4 bg-green-800 p-4 rounded">
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
            <a key={index} href="#" className="block hover:underline">
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};


const Customer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 3;

  const showSlide = (index) => {
    if (index >= totalSlides) setCurrentIndex(0);
    else if (index < 0) setCurrentIndex(totalSlides - 1);
    else setCurrentIndex(index);
  };

  const slides = [
    { src: "slide1.jpg", text: "Sustainable Living is Easy", button: "SHOP SUSTAINABLE →" },
    { src: "slide2.jpg", text: "Choose Planet Over Plastic", button: "SHOP BETTER →" },
    { src: "slide3.jpg", text: "Green Living Solutions", button: "EXPLORE NOW →" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

 

  return (
		<div className="font-sans">
			{/* Navbar */}
			<div className="flex justify-between items-center bg-green-700 p-4 text-white">
				<div className="text-2xl font-bold">GreenLiving</div>
				<div className="hidden md:flex space-x-4">
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
			</div>

			{/* Image Slider */}
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

			{/* Product Sections */}
			<h1 className="text-3xl text-center mt-6 font-bold">Our Top Picks</h1>
	
				<div className="p-6 grid grid-cols-1 md:grid-cols-1 gap-6 max-w-[100rem] mx-auto">
					{[
						{
							category: "Care",
							products: ["care1.jpg", "care2.jpg", "care3.jpg", "care4.jpg"],
						},
						{
							category: "Cleaning",
							products: [
								"fashion1.jpg",
								"fashion2.jpg",
								"fashion3.jpg",
								"fashion4.jpg",
							],
						},
						{
							category: "Kitchen Essentials",
							products: [
								"essent1.jpg",
								"essent2.jpg",
								"essent3.jpg",
								"essent4.jpg",
							],
						},
					].map((section, idx) => (
						<div key={idx} className="text-center my-10">
							{" "}
							{/* Centers the heading */}
							<h2 className="text-2xl font-semibold my-6">
								{section.category}
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center mx-auto">
								{section.products.map((img, index) => (
									<div
										key={index}
										className="border rounded-lg shadow-md p-4 bg-white flex flex-col items-center justify-between h-[350px] w-[250px] xl:h-[450px] xl:w-[350px]"
									>
										<img
											src={`/images/${img}`}
											alt="product"
											className="w-full h-40 object-cover rounded-md"
										/>
										<h3 className="text-lg font-semibold mt-2">
											Product {index + 1}
										</h3>
										<p className="text-green-700 font-bold">
											${(index + 1) * 10 + 15}
										</p>
										<button className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md w-full">
											Add to Cart
										</button>
									</div>
								))}
							</div>
						</div>
					))}
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
	);
};

export default Customer;

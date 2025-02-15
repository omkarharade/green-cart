"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../../../../apiConfig";
import CartItem from "./cartItem"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
		{ name: "products", route: "/view/customer" },
		{ name: "cart", route: "/view/customer/cart" },
		{ name: "past orders", route: "/view/customer/orders" },
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

const ShoppingCart = (props) => {
  const [cartProducts, setCartProducts] = useState([]);
  const userId = sessionStorage.getItem("userId");
  const [address, setAddress] = useState("");


  useEffect(() => {

    fetchCartItems();

  }, []);

  const updateAddress = (updatedAddress) => {
    setAddress(updatedAddress);
  };

  const fetchCartItems = () => {
    axios
    .get(`${getBaseURL()}api/cart/${userId}`)
    .then((res) => {
      setCartProducts(res.data);
    })
    .catch((err) => console.log("Error occurred"));
  }


  const buyProducts = () => {
    // Retrieve JWT token from session storage
    const token = sessionStorage.getItem('jwt_token');

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
          Authorization: `Bearer ${token}`
        }
      };

      axios
        .post(`${getBaseURL()}api/cart/buy/${userId}`, { ...customerPayload }, config)
        .then((res) => {
          setCartProducts([]);
          setAddress("");
          alert("Order placed successfully");
        })
        .catch(error => {
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

  return (
    <div>

      <Navbar/>

      {cartProducts?.length > 0 && (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Shopping Cart
          </h1>

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

          {/* Address Input and Buy Button */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
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
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
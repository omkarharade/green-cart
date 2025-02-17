"use client"
import React from "react";
import { Trash2 } from "lucide-react";

const CartItem = ({ product, removeProduct}) => {


  return (
    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md flex-col sm:flex-row">
      {/* Product Image */}
      <img
        src={product.imageURL}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      {/* Product Details */}
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
        <p className="text-sm font-mediumz text-gray-700">
          Total: ₹{product.price * product.quantity}
        </p>
      </div>

      {/* Remove Button */}
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        onClick={() => removeProduct(product.productId)}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;

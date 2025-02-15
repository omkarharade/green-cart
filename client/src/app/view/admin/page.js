"use client"

import {React, useState, useEffect} from 'react'
import { Trash2 } from "lucide-react";
import axios from "axios"
import { getBaseURL } from "../../../apiConfig";
import { useRouter, redirect} from "next/navigation";

const ProductCard = ({ productId, name, price, description, imageURL, onDelete }) => {
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
          <img src={imageURL} alt={name} className="w-full h-40 object-cover rounded-md" />
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
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productDesc, setProductDesc] = useState("");
    const [productImageURL, setProductImageURL] = useState("");
    const router = useRouter();

    const addProduct = () => {
      let name = productName;
      let price = productPrice;
      let description = productDesc;
      let imageURL = productImageURL;
      if (
        name !== "" &&
        price > 0 &&
        description !== "" &&
        productImageURL !== ""
      ) {
        axios
          .post(`${getBaseURL()}api/products/create`, {
            name,
            price,
            description,
            imageURL,
          })
          .then((res) => {
            console.log("Product added");
            fetchProducts();
          })
          .catch((err) =>
            console.log(
              "Product cannot be added, missing details or some error occurred"
            )
          );
      }
    };
  
    useEffect(() => {
      
      fetchProducts();

    }, []);
  
    const openProductDetails = (product) => {
      props.handleProductDetails(product);
    };
  
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

    console.log("products", products)

    return (
      <div className="flex flex-wrap">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} onDelete={() => deleteProduct(product.productId)}  />
        ))}
      </div>
    );
  };

export default Admin
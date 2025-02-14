"use client"

import {React, useState, useEffect} from 'react'
import axios from "axios"
import { getBaseURL } from "../../../apiConfig";

const ProductCard = ({ name, price, description, imageURL }) => {
  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white flex flex-col items-center justify-between h-[400px] w-[250px] mx-5 my-5">
      <img src={imageURL} alt={name} className="w-full h-40 object-cover rounded-md" />
      <h3 className="text-lg font-semibold mt-2">{name}</h3>
      <p className="text-gray-600 text-sm text-center px-2">{description}</p>
      <p className="text-green-700 font-bold">${price}</p>
      <button className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md w-full">
        Add to Cart
      </button>
    </div>
  );
};


function Admin() {

  const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productDesc, setProductDesc] = useState("");
    const [productImageURL, setProductImageURL] = useState("");
  
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

      console.log("products", products)
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

    return (
      <div className="flex flex-wrap">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    );
  };

export default Admin
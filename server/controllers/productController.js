// productController.js

const productModel = require("../models/productModel");

exports.getAllProducts = (req, res) => {
    productModel.getAllProducts()
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

exports.getProductsByCategory = (req, res) => {
    const category = req.params.category;

    productModel.getProductsByCategory(category)
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Error getting products by category" });
        })
}


exports.getTopPicks = (req, res) => {
    productModel.getTopPicks()
        .then(topPicks => {
            res.json(topPicks);
        })
        .catch(error => {
            console.error("Error fetching top picks:", error);
            res.status(500).json({ error: "Error fetching top picks" });
        });
};


exports.getProductDetailsById = (req, res) => {
    const productId = req.params.id;
    productModel.getProductDetailsById(productId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error fetching product.");
        });
};

exports.allOrderByProductId = (req, res) => {
    const productId = req.params.id;
    productModel.allOrderByProductId(productId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error fetching product.");
        });
};

exports.createProduct = (req, res) => {
    const { name, price, description, imageURL, category } = req.body;
    productModel.createProduct(name, price, description, imageURL, category)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send(err.message);
        });
};

exports.updateProduct = (req, res) => {
    const { id, name, price, description } = req.body;
    productModel.updateProduct(id, name, price, description)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error updating product.");
        });
};

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    productModel.deleteProduct(productId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error deleting product.");
        });
};

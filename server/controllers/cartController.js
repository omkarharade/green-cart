// cartController.js

const cartModel = require("../models/cartModel");
const { verifyToken } = require('../utils/token'); 


exports.getShoppingCart = (req, res) => {
    const userId = req.params.userId;
    cartModel.getShoppingCart(userId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error fetching shopping cart.");
        });
};

exports.addToCart = (req, res) => {
    const { userId, productId, quantity, isPresent } = req.body;
    cartModel.addToCart(userId, productId, quantity, isPresent)
        .then(result => {
            console.log("product added to cart")
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error adding product to cart.");
        });
};

exports.addPremiumToCart = 

exports.removeFromCart = (req, res) => {
    const productId = req.params.productId;
    const userId = req.params.userId;
    cartModel.removeFromCart(productId, userId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error removing product from cart.");
        });
};


exports.buy = (req, res) => {
    // Extract JWT token from the request headers
    const token = req.headers.authorization;

    // Check if token is present and properly formatted
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: Missing or invalid token');
    }

    // Extract the token from the header
    const tokenValue = token.split(' ')[1];

    // Verify the token
    verifyToken(tokenValue)
        .then(decoded => {
            // Token is valid, proceed with cartModel.buy function
            const customerId = req.params.id;
            const address = req.body.address;

            cartModel.buy(customerId, address)
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    console.error(err.message);
                    res.status(500).send("Error removing product from cart.");
                });
        })
        .catch(err => {
            // Token verification failed
            console.error('Token verification failed:', err);
            return res.status(401).send('Unauthorized: Invalid token');
        });
};

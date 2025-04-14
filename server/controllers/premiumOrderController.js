const premiumOrderModel = require("../models/premiumOrderModel");
const {verifyToken} = require("../utils/token")

exports.getAllProducts = (req, res) => {
	premiumOrderModel
		.getAllProducts()
		.then((products) => {
			res.json(products);
		})
		.catch((error) => {
			console.error("Error fetching premium products:", error);
			res.status(500).json({ error: "Internal Server Error" });
		});
};

exports.create = (req, res) => {
	// Extract JWT token from the request headers
	const token = req.headers.authorization;

	// Check if token is present and properly formatted
	if (!token || !token.startsWith("Bearer ")) {
		return res.status(401).send("Unauthorized: Missing or invalid token");
	}

	// Extract the token from the header
	const tokenValue = token.split(" ")[1];

	// Verify the token
	verifyToken(tokenValue)
		.then((decoded) => {
			const { userId, address, price, subscriptionId } = req.body;
			// userId, address, totalPrice, subscriptionId
			premiumOrderModel
				.createPremiumOrder(userId, address,price , subscriptionId)
				.then((products) => {
					res.json(products);
				})
				.catch((error) => {
					console.error("Error creating order:", error);
					res.status(500).json({ error: "Internal Server Error" });
				});
		})
		.catch((err) => {
			// Token verification failed
			console.error("Token verification failed:", err);
			return res.status(401).send("Unauthorized: Invalid token");
		});
};

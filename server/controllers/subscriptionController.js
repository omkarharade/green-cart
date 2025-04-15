const express = require("express");
const subscriptionModel = require("../models/subscriptionModel");
const moment = require("moment-timezone");
const { getPremiumProductsByType } = require("../models/premiumProductModel");
const { cancelSubscriptionByType, getDetailsByType } = require("../models/subscriptionModel");

const {
	EXCHANGE_NAME,
	ROUTING_KEY,
	QUEUE_NAME,
	BACKEND_API_URL,
} = require("../config/serverConfig");
const { default: axios } = require("axios");

exports.createSubscription = async (req, res) => {
	const { userId, planName, address } = req.body;
	const channel = req.channel;

	// Calculate endDate and nextOrderDate based on planName
	let endDate, nextOrderDate;

	const now = moment().tz("Asia/Kolkata"); // Get the current time in IST

	if (planName === "Deluxe Box") {
	  endDate = moment(now).add(6, 'months').tz('Asia/Kolkata').toDate();
	  nextOrderDate = moment(now).tz('Asia/Kolkata').toDate(); // Setting first order date to current time
	} else if (planName === 'Family Box') {
	  endDate = moment(now).add(6, 'months').tz('Asia/Kolkata').toDate();
	  nextOrderDate = moment(now).tz('Asia/Kolkata').toDate(); // Setting first order date to current time
	} else if (planName === 'Basic Box') { // added end date for basic box plan too
	  endDate = moment(now).add(6, 'months').tz('Asia/Kolkata').toDate();
	  nextOrderDate = null;
	}

	// if (planName === "Deluxe Box") {
	// 	endDate = moment(now).add(6, "months").tz("Asia/Kolkata").toDate();
	// 	nextOrderDate = moment(now).add(2, "minutes").tz("Asia/Kolkata").toDate(); // Set nextOrderDate 2 minutes in the future
	// } else if (planName === "Family Box") {
	// 	endDate = moment(now).add(6, "months").tz("Asia/Kolkata").toDate();
	// 	nextOrderDate = moment(now).add(2, "minutes").tz("Asia/Kolkata").toDate(); // Set nextOrderDate 2 minutes in the future
	// } else if (planName === "Basic Box") {
	// 	endDate = moment(now).add(6, "months").tz("Asia/Kolkata").toDate();
	// 	nextOrderDate = null // Even for Basic Box, set it to 2 minutes for testing
	// }

	// Calculate discount based on planName
	let discount = 0;
	if (planName === "Deluxe Box") {
		discount = 10;
	} else if (planName === "Family Box") {
		discount = 15;
	}

	// process the orders first time while subscribing . . . . . .

	console.log("end date: ", endDate);
	console.log("next order date: ", nextOrderDate);
	console.log(
		"moment.now : ",
		moment(now).add(6, "months").tz("Asia/Kolkata").toDate()
	);

	// Refactored using Promises
	subscriptionModel
		.createSubscription(
			userId,
			planName,
			address,
			endDate,
			nextOrderDate,
			discount
		)
		.then((subscription) => {
			console.log("sql response === ", subscription);

			const delay = nextOrderDate - now;

			if (planName !== "Basic Box") {
				console.log("channel.publish ==  ", channel.publish);
				return channel.publish(
					EXCHANGE_NAME,
					ROUTING_KEY,
					Buffer.from(
						JSON.stringify({
							...subscription,
							next_order_date: nextOrderDate,
							end_date: endDate,
						})
					),
					{ persistent: true, headers: { "x-delay": delay } }
				);
			} else {
				
				return channel.sendToQueue(
					QUEUE_NAME,
					Buffer.from(
						JSON.stringify({
							...subscription,
							next_order_date: nextOrderDate,
							end_date: endDate,
						})
					),
					{ persistent: true }
				);
			}
		})

		.then((subscription) => {
			res.status(201).json({ subscription, message: "success" });
		})

		.catch((error) => {
			console.error("Error creating subscription:", error);
			res.status(500).json({ error: "Failed to create subscription" });
		});
};

exports.processSubscription = async (subscription, channel, config) => {
	/*
     
    subscription : {
        id,
        user_id, 
        delivery_address,
        end_date,
        next_order_date,
    }
     */

	console.log("Processing subscription:", subscription);

	try {
		// 1. Add products to cart based on subscription.plan_name
		let cartItems = [];
		let totalPrice = 0.0;
		if (subscription.plan_name === "Deluxe Box") {
			const premiumProductResult = await getPremiumProductsByType("Deluxe Box");

			if (premiumProductResult) {
				premiumProductResult.forEach((product) => {
					console.log("inside the loop price == ", product.price);
					totalPrice += parseFloat(product.price);

					console.log("inside the loop totalPrice == ", totalPrice);
				});
			}
		} else if (subscription.plan_name === "Family Box") {
			const premiumProductResult = await getPremiumProductsByType("Family Box");
			if (premiumProductResult) {
				premiumProductResult.forEach((product) => {
					totalPrice += parseFloat(product.price);
				});
			}
		} else {
			// Basic Box - Implement your logic to add regular products to the cart here.
			const productResult = await getPremiumProductsByType("Basic Box"); // Fetch up to 5 regular products 
			if (productResult) {
				productResult.forEach((product) => {
					totalPrice += parseFloat(product.price);
				});
			}
		}

		totalPrice = parseFloat(totalPrice.toFixed(2));
		console.log("total Price == ", totalPrice);

		// 2. Place the order
		const address = subscription.delivery_address;
		const orderResponse = await axios.post(
			`${BACKEND_API_URL}api/premium/orders/create`,
			{
				userId: subscription.user_id,
				address: address,
				price: totalPrice,
				subscriptionId: subscription.id,
			},
			config
		);

		console.log("order response  == ", orderResponse.data);

		// 3. Schedule next recurring order and update subscription status
		let now = new Date();
        let endDate = new Date(subscription.end_date);
		let nextOrderDate, delay;
        

		if (
			subscription.plan_name === "Deluxe Box" &&
			endDate > now
		) {
			nextOrderDate = new Date(subscription.next_order_date);
			nextOrderDate.setDate(nextOrderDate.getDate() + 14);
			delay = nextOrderDate.getTime() - Date.now();
		} else if (
			subscription.plan_name === "Family Box" &&
			endDate > now
		) {
			nextOrderDate = new Date(subscription.next_order_date);
			nextOrderDate.setMonth(nextOrderDate.getMonth() + 1);
			delay = nextOrderDate.getTime() - Date.now();
		}

        // console.log("checkpoint 1 ======", "hii ")

        // console.log(subscription.end_date > now, "checkpoint 2")
        // console.log("subscription.end_date", endDate);
        // console.log("now", now);
        // if (subscription.plan_name === "Deluxe Box" && endDate > now) {

        //     nextOrderDate = new Date(subscription.next_order_date);
        //     nextOrderDate.setMinutes(nextOrderDate.getMinutes() + 2); // Add 2 minutes
        //     console.log("1 ==== next order date =====", nextOrderDate);
        //     delay = nextOrderDate.getTime() - Date.now();
        // } else if (subscription.plan_name === "Family Box" && endDate > now) {
        //     nextOrderDate = new Date(subscription.next_order_date);
        //     nextOrderDate.setMinutes(nextOrderDate.getMinutes() + 2); // Add 2 minutes
        //     console.log("1 ==== next order date =====", nextOrderDate);
        //     delay = nextOrderDate.getTime() - Date.now();
        // } 


		let updatedStatus = "active";
		if (endDate && nextOrderDate > endDate) {
			updatedStatus = "completed";
			delay = 0; // No recurring orders if end_date is reached
		}

		if (delay > 0) {
			// Publish the updated subscription for the next recurring order
			await channel.publish(
				EXCHANGE_NAME,
				ROUTING_KEY,
				Buffer.from(
					JSON.stringify({ ...subscription, next_order_date: nextOrderDate })
				),
				{ persistent: true, headers: { "x-delay": delay } }
			);
		}

        console.log("updated next order date  ==========", nextOrderDate);
		await subscriptionModel.updateSubscription(
			subscription.id,
			nextOrderDate,
			updatedStatus
		);
	} catch (error) {
		console.error("Error processing order:", error);
		// ... Implement robust error handling (retry, dead-letter queue, etc.)
	}
};


exports.getPremiumProductsByType = (req, res) => { // Removed async since we're using promises now
    const subscriptionType = req.params.subscriptionType;

    if (!subscriptionType) {
        return res.status(400).json({ error: "subscriptionType is required" });
    }


    getPremiumProductsByType(subscriptionType) // Call the model function and use .then/.catch
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error("Error fetching premium products:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });


};

exports.cancelSubscription = (req, res) => { 
    const { userId, planName } = req.body;

    cancelSubscriptionByType(userId, planName)
        .then(result => {
            res.json({ message: "Subscription cancelled successfully", deletedCount: result.affectedRows });
        })
        .catch(error => {
            if (error.message === "Subscription not found.") {
                return res.status(404).json({ error: "Subscription not found." });
            }
            console.error("Error cancelling subscription:", error);
            res.status(500).json({ error: "Failed to cancel subscription" });
        });
};

exports.getDetails = (req, res) => {
    const userId = req.params.userId; 
    const planName = req.params.planName; 

    if (!userId || !planName) { // Input validation
        return res.status(400).json({ error: "userId and planName are required" });
    }


    getDetailsByType(userId, planName)
        .then(subscriptionDetails => {
            res.json(subscriptionDetails); // Send the subscription details
        })
        .catch(error => {
            if (error.message === "Subscription not found.") { // Specific error handling for "not found"
                return res.status(404).json({ error: "Subscription not found.", data : error.data});
            }
            console.error("Error fetching subscription details:", error);
            res.status(500).json({ error: "Failed to fetch subscription details" });// General error handling
        });
};
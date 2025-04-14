const express = require("express")
const subscriptionModel = require("../models/subscriptionModel");
const moment  = require("moment-timezone")
const { getPremiumProductsByType } = require("../models/premiumProductModel");
const { EXCHANGE_NAME, ROUTING_KEY, QUEUE_NAME, BACKEND_API_URL } = require("../config/serverConfig");
const { default: axios } = require("axios");

exports.createSubscription = async (req, res) => {

    const { userId, planName, address } = req.body;
    const channel = req.channel;

    // Calculate endDate and nextOrderDate based on planName
    let endDate, nextOrderDate;

    const now = moment().tz('Asia/Kolkata'); // Get the current time in IST


    if (planName === "Deluxe Box") {
      endDate = moment(now).add(6, 'months').tz('Asia/Kolkata').toDate();
      nextOrderDate = moment(now).tz('Asia/Kolkata').toDate(); // Setting first order date to current time
    } else if (planName === 'Family Box') {
      endDate = moment(now).add(6, 'months').tz('Asia/Kolkata').toDate();
      nextOrderDate = moment(now).tz('Asia/Kolkata').toDate(); // Setting first order date to current time
    } else if (planName === 'Basic Box') { // added end date for basic box plan too
      endDate = moment(now).add(6, 'months').tz('Asia/Kolkata').toDate();
      nextOrderDate = moment(now).tz('Asia/Kolkata').toDate(); // Setting next order date to current time as it is non recurring plan type
    }


    // Calculate discount based on planName
    let discount = 0;
    if (planName === 'Deluxe Box') {
        discount = 10;
    } else if (planName === 'Family Box') {
        discount = 15;
    }


    // process the orders first time while subscribing . . . . . . 

    console.log("end date: ", endDate);
    console.log("next order date: ", nextOrderDate);
    console.log("moment.now : ", moment(now).add(6, 'months').tz('Asia/Kolkata').toDate());


    // Refactored using Promises
    subscriptionModel.createSubscription(userId, planName, address, endDate, nextOrderDate, discount)
    .then(subscription => {


        console.log("sql response === ", subscription);

        const delay = 0;

        if (planName !== 'Basic Box') {

            console.log("channel.publish ==  ", channel.publish)
            return channel.publish(EXCHANGE_NAME, ROUTING_KEY, Buffer.from(JSON.stringify({ ...subscription, next_order_date: nextOrderDate, end_date: endDate})), { persistent: true, headers: { 'x-delay': delay } });

        } else {

            res.status(201).json({ message: 'Basic Box subscribed successfully!' });
            return channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ ...subscription, next_order_date: nextOrderDate, end_date: endDate})), { persistent: true });

        }

    })

    .then((subscription) => {

            res.status(201).json({subscription, message: "success"});

    })



    .catch(error => {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
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
              if (subscription.plan_name === "Deluxe Box") {
                  const premiumProductResult = await getPremiumProductsByType("Deluxe Box");

                  console.log("premiumproductsResult === ", premiumProductResult);
                  if (premiumProductResult.rows) {
                      premiumProductResult.rows.forEach(product => {

                        // userId, productId, quantity, isPresent
                          cartItems.push({
                              productId: product.productId,
                              quantity: 1, // Adjust quantity as needed
                          });
                      });
                  }

              } else if (subscription.plan_name === 'Family Box') {
                  const premiumProductResult = await getPremiumProductsByType("Family Box");
                  if (premiumProductResult.rows) {
                      premiumProductResult.rows.forEach(product => {
                          cartItems.push({
                              productId: product.productId,
                              quantity: product.quantity, // Or appropriate higher quantity for family box
                          });
                      });
                  }

              } else {
                  // Basic Box - Implement your logic to add regular products to the cart here.
                   const productResult = await pool.query('SELECT * FROM product LIMIT 5'); // Fetch up to 5 regular products (replace with your logic)
                   if (productResult.rows) {
                     productResult.rows.forEach(product => {
                         cartItems.push({
                             productId: product.productId,
                             quantity: 1
                         });
                     });
                 }
              }


              // Add items to cart using the /api/cart/add route.

              console.log("cart items == ", cartItems);
              for (const item of cartItems) {

                  await axios.post(`${BACKEND_API_URL}api/cart/add`, { userId: subscription.user_id, productId: item.productId, quantity: item.quantity, isPresent:false}, config);
              }

              // 2. Place the order
              const address = subscription.delivery_address;
              const orderResponse = await axios.post(`${BACKEND_API_URL}api/cart/buy/${subscription.user_id}`, { address: address }, config);

              console.log("order response  == ", orderResponse);

              // 3. Schedule next recurring order and update subscription status
              const now = new Date();
              let nextOrderDate, delay;

              if (subscription.plan_name === 'Deluxe Box' && subscription.end_date > now) {
                  nextOrderDate = new Date(subscription.next_order_date);
                  nextOrderDate.setDate(nextOrderDate.getDate() + 14);
                  delay = nextOrderDate.getTime() - Date.now();

              } else if (subscription.plan_name === 'Family Box' && subscription.end_date > now) {
                  nextOrderDate = new Date(subscription.next_order_date);
                  nextOrderDate.setMonth(nextOrderDate.getMonth() + 1);
                  delay = nextOrderDate.getTime() - Date.now();
              }

              let updatedStatus = 'active';
              if (subscription.end_date && nextOrderDate > subscription.end_date) {
                  updatedStatus = 'completed';
                  delay = 0; // No recurring orders if end_date is reached

              }

              if (delay > 0) {
                  // Publish the updated subscription for the next recurring order
                  await channel.publish(EXCHANGE_NAME, ROUTING_KEY, Buffer.from(JSON.stringify({ ...subscription, next_order_date: nextOrderDate })), { persistent: true, headers: { 'x-delay': delay } });
              }

              await subscriptionModel.updateSubscription(subscription.id, nextOrderDate, updatedStatus);

          } catch (error) {
              console.error('Error processing order:', error);
              // ... Implement robust error handling (retry, dead-letter queue, etc.)

          }
}

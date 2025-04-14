// app.js
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto")
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userToken = require("./routes/userTokenRoute")
const {PORT, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY} = require("./config/serverConfig")
const subscriptionModel = require("./models/subscriptionModel");
const amqp = require('amqplib');
const premiumProductsModel = require("./models/premiumProductModel"); //Require here or inside processOrderQueue.  Your preference.
const axios = require("axios")
const pool = require('./database/connection');
const subscriptionController = require("./controllers/subscriptionController");
const { generateAccessAndRefreshToken } = require("./utils/token");

const app = express();

app.use(cors());
app.use(express.json());

// rabbit MQ setup variables 
let channel;


// Connect to the database

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/token", userToken);

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID, // Replace with your actual Razorpay key
    key_secret: RAZORPAY_KEY_SECRET, // Replace with your Razorpay secret
  });


  // RabbitMQ Setup
async function setupRabbitMQ() {
  try {
      const connection = await amqp.connect('amqp://localhost'); // Use appropriate connection string
      channel = await connection.createChannel(); // Assign the channel to the outer variable

      await channel.assertExchange(EXCHANGE_NAME, 'x-delayed-message', {
          durable: true,
          arguments: { 'x-delayed-type': 'direct' }
      });
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

      console.log('RabbitMQ setup complete.');
      return channel; // Return the channel

  } catch (error) {
      console.error('Error setting up RabbitMQ:', error);
      throw error;
  }
}


// Order Processing Function
async function processOrderQueue(returnedChannel) {


  returnedChannel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
          const subscription = JSON.parse(msg.content.toString());

          console.log("message object from  message queue ===", msg.content.toString())

          const userId = subscription.userId;

          const userData = {
            userId: subscription.userId,
            isAdmin: false  // as admin will not subscribe to the plan 
          }

          const {token, refreshToken} = generateAccessAndRefreshToken(userData); // generating valid token for processing order

          const config = { headers: { Authorization: `Bearer ${token}` } };
          await subscriptionController.processSubscription(subscription, returnedChannel, config);

          returnedChannel.ack(msg); // Acknowledge message processing
      }
  });
}



// Payment Order Creation
app.post("/create-order", async (req, res) => {
    const { amount, currency } = req.body;
  
    try {
      const options = {
        amount: amount * 100, // Amount in paise (1 INR = 100 paise)
        currency: currency || "INR",
        receipt: `receipt_${crypto.randomBytes(8).toString("hex")}`,
      };
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (err) {
      console.error("Error creating Razorpay order:", err.message);
      res.status(500).json({ error: "Failed to create order." });
    }
  });
  
  // Payment Verification
  app.post("/verify-payment", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
  
    if (generatedSignature === razorpay_signature) {
      res.json({ message: "Payment verified successfully." });
    } else {
      res.status(400).json({ error: "Payment verification failed." });
    }
  });

//Start Server
async function startServer() {
  try {

    const returnedChannel = await setupRabbitMQ();
    processOrderQueue(returnedChannel); // Use after setupRabbitMQ has assigned the channel
    
    app.use("/api/subscriptions", subscriptionRoutes(returnedChannel));

      // ... your server start logic (e.g., app.listen)
      app.listen(PORT || 3001, () => {
        console.log(`Server is running on port ${PORT || 3001}`);
    });

  } catch (error) {

      console.error("Error starting server:", error);

  }

}

// starting the server here
startServer();



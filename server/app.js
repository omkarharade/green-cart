// app.js
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto")
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userToken = require("./routes/userTokenRoute")
const {PORT, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET} = require("./config/serverConfig")

const app = express();

app.use(cors());
app.use(express.json());

// Connect to the database

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/token", userToken)


const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID, // Replace with your actual Razorpay key
    key_secret: RAZORPAY_KEY_SECRET, // Replace with your Razorpay secret
  });


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



app.listen(PORT || 3001, () => {
    console.log(`Server is running on port ${PORT || 3001}`);
});

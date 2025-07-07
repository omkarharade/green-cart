const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  ROUTING_KEY:process.env.ROUTING_KEY,
  QUEUE_NAME:process.env.QUEUE_NAME,
  BACKEND_API_URL:process.env.BACKEND_API_URL,
  DB_SERVER_USER: process.env.DB_SERVER_USER,
  DB_SERVER_HOST: process.env.DB_SERVER_HOST,
  DB_SERVER_PASSWORD: process.env.DB_SERVER_PASSWORD,
  DB_SERVER_DATABASE: process.env.DB_SERVER_DATABASE
};
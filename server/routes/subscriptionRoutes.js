const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const { withChannel } = require("../middlewares/messageChannel");


// Export a function that takes the channel and returns the router
module.exports = (channel) => {  // The route now accepts the channel as an argument


  // console.log("routes part : ", channel);

  router.post("/", withChannel(channel), subscriptionController.createSubscription);


return router;
};
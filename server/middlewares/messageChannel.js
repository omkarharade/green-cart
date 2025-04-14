  
  
  // Higher-order function to inject the channel
  exports.withChannel = (channel) => {
    return (req, res, next) => {

      // console.log("middlewares part : ", channel);
      req.channel = channel; // Add channel to the request object
      next(); // Call the next middleware (your route handler)
    };
  }


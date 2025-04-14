const express = require("express");
const router = express.Router();
const premiumOrderController = require("../controllers/premiumOrderController");

router.post("/create", premiumOrderController.create);

module.exports = router;
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
// You can include auth middleware if needed
// const { authMiddleware } = require("../middleware/auth");

router.post("/create-order", paymentController.createOrder);
router.post("/verify-payment", paymentController.verifyPayment);

module.exports = router;

const express = require("express");

const orderController = require("../controllers/order.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  validateCheckoutPayload,
} = require("../middleware/validation.middleware");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  validateCheckoutPayload,
  orderController.createOrder,
);
router.get("/", requireAuth, orderController.getOrders);

module.exports = router;

const express = require("express");

const consumerController = require("../controllers/consumer.controller");
const {
  validateConsumerPayload,
} = require("../middleware/validation.middleware");

const router = express.Router();

router.post("/", validateConsumerPayload, consumerController.createConsumer);
router.get("/", consumerController.getConsumers);

module.exports = router;

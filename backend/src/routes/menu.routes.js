const express = require("express");

const menuController = require("../controllers/menu.controller");
const {
  validateMenuPayload,
  validateMenuQuery,
} = require("../middleware/validation.middleware");

const router = express.Router();

router.post("/", validateMenuPayload, menuController.createMenu);
router.get("/", validateMenuQuery, menuController.getMenu);
router.post("/:menuId/order", menuController.createOrder);

module.exports = router;

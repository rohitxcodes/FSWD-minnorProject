const express = require("express");

const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  validateAuthRegisterPayload,
  validateAuthLoginPayload,
} = require("../middleware/validation.middleware");

const router = express.Router();

router.post("/register", validateAuthRegisterPayload, authController.register);
router.post("/login", validateAuthLoginPayload, authController.login);
router.get("/me", requireAuth, authController.me);

module.exports = router;

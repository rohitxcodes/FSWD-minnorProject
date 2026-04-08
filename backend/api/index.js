const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  override: false,
});

const app = require("../src/app");
const connectDB = require("../src/config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to initialize server",
      error: error.message,
    });
  }
};

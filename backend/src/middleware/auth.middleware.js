const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      const error = new Error("Authorization token is required");
      error.status = 401;
      throw error;
    }

    const token = authHeader.slice(7).trim();
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-jwt-secret",
    );
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      const error = new Error("User not found for this token");
      error.status = 401;
      throw error;
    }

    req.user = user;
    req.auth = { token, userId: user._id };

    return next();
  } catch (error) {
    const unauthorized = new Error("Invalid or expired token");
    unauthorized.status = 401;
    return next(error.status ? error : unauthorized);
  }
};

module.exports = {
  requireAuth,
};

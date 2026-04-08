const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const SALT_ROUNDS = 10;

const buildToken = (userId) =>
  jwt.sign(
    { userId: String(userId) },
    process.env.JWT_SECRET || "development-jwt-secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const registerUser = async (payload) => {
  const existing = await User.findOne({ email: payload.email.toLowerCase() });

  if (existing) {
    const error = new Error("User already exists with this email");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    phone: payload.phone,
    passwordHash,
  });

  const token = buildToken(user._id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );

  if (!isPasswordMatch) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = buildToken(user._id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");

  if (!user) {
    const error = new Error("User profile not found");
    error.status = 404;
    throw error;
  }

  return sanitizeUser(user);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};

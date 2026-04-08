const buildValidationError = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

const isValidPhone = (value) => /^[0-9+\-()\s]{7,20}$/.test(String(value));

const validateConsumerPayload = (req, res, next) => {
  const { name, email, phone } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return next(buildValidationError("Consumer name is required"));
  }

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return next(buildValidationError("A valid consumer email is required"));
  }

  if (!phone || typeof phone !== "string" || !isValidPhone(phone)) {
    return next(buildValidationError("A valid consumer phone is required"));
  }

  req.body = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
  };

  return next();
};

const validateMenuPayload = (req, res, next) => {
  const { name, description, price } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return next(buildValidationError("Menu name is required"));
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    return next(buildValidationError("Menu description is required"));
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return next(
      buildValidationError("Menu price must be a non-negative number"),
    );
  }

  req.body = {
    name: name.trim(),
    description: description.trim(),
    price: numericPrice,
  };

  return next();
};

const validateMenuQuery = (req, res, next) => {
  const { minPrice, maxPrice } = req.query;

  if (minPrice !== undefined) {
    const parsedMin = Number(minPrice);

    if (!Number.isFinite(parsedMin)) {
      return next(buildValidationError("minPrice must be a number"));
    }

    req.query.minPrice = parsedMin;
  }

  if (maxPrice !== undefined) {
    const parsedMax = Number(maxPrice);

    if (!Number.isFinite(parsedMax)) {
      return next(buildValidationError("maxPrice must be a number"));
    }

    req.query.maxPrice = parsedMax;
  }

  if (
    req.query.minPrice !== undefined &&
    req.query.maxPrice !== undefined &&
    Number(req.query.minPrice) > Number(req.query.maxPrice)
  ) {
    return next(
      buildValidationError("minPrice cannot be greater than maxPrice"),
    );
  }

  return next();
};

const isValidObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value));

const validateCheckoutPayload = (req, res, next) => {
  const { deliveryAddress, paymentMethod, items } = req.body || {};

  if (
    !deliveryAddress ||
    typeof deliveryAddress !== "string" ||
    !deliveryAddress.trim()
  ) {
    return next(buildValidationError("Delivery address is required"));
  }

  if (!Array.isArray(items) || !items.length) {
    return next(
      buildValidationError("Checkout requires at least one cart item"),
    );
  }

  if (
    paymentMethod !== undefined &&
    !["cod", "upi", "card"].includes(paymentMethod)
  ) {
    return next(
      buildValidationError("Payment method must be cod, upi, or card"),
    );
  }

  for (const item of items) {
    if (!item || !isValidObjectId(item.menuId)) {
      return next(
        buildValidationError("Each cart item must include a valid menuId"),
      );
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return next(
        buildValidationError(
          "Each cart item must include a quantity greater than 0",
        ),
      );
    }
  }

  req.body = {
    deliveryAddress: deliveryAddress.trim(),
    paymentMethod: paymentMethod || "cod",
    items: items.map((item) => ({
      menuId: String(item.menuId),
      quantity: Number(item.quantity),
    })),
  };

  return next();
};

const validateAuthRegisterPayload = (req, res, next) => {
  const { name, email, phone, password } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return next(buildValidationError("Name is required"));
  }

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return next(buildValidationError("A valid email is required"));
  }

  if (!phone || typeof phone !== "string" || !isValidPhone(phone)) {
    return next(buildValidationError("A valid phone is required"));
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return next(
      buildValidationError(
        "Password is required and must be at least 6 characters",
      ),
    );
  }

  req.body = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password,
  };

  return next();
};

const validateAuthLoginPayload = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return next(buildValidationError("A valid email is required"));
  }

  if (!password || typeof password !== "string") {
    return next(buildValidationError("Password is required"));
  }

  req.body = {
    email: email.trim().toLowerCase(),
    password,
  };

  return next();
};

module.exports = {
  validateConsumerPayload,
  validateMenuPayload,
  validateMenuQuery,
  validateCheckoutPayload,
  validateAuthRegisterPayload,
  validateAuthLoginPayload,
};

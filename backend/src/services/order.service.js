const Menu = require("../models/menu.model");
const Order = require("../models/order.model");

const TAX_RATE = 0.05;
const DELIVERY_FEE = 40;
const FREE_DELIVERY_THRESHOLD = 500;

const createOrder = async (orderPayload, user) => {
  const requestedItems = orderPayload.items;
  const requestedIds = requestedItems.map((item) => item.menuId);
  const menus = await Menu.find({ _id: { $in: requestedIds } });
  const menuMap = new Map(menus.map((menu) => [String(menu._id), menu]));

  const missingItems = requestedItems.filter(
    (item) => !menuMap.has(String(item.menuId)),
  );

  if (missingItems.length) {
    const error = new Error("One or more menu items are unavailable");
    error.status = 404;
    throw error;
  }

  const normalizedItems = requestedItems.map((item) => {
    const menu = menuMap.get(String(item.menuId));
    const lineTotal = Number(menu.price) * Number(item.quantity);

    return {
      menuId: menu._id,
      name: menu.name,
      price: Number(menu.price),
      quantity: Number(item.quantity),
      lineTotal,
    };
  });

  const subtotal = normalizedItems.reduce(
    (accumulator, item) => accumulator + item.lineTotal,
    0,
  );
  const taxAmount = Number((subtotal * TAX_RATE).toFixed(2));
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const totalAmount = Number((subtotal + taxAmount + deliveryFee).toFixed(2));

  return Order.create({
    userId: user._id,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
    deliveryAddress: orderPayload.deliveryAddress,
    paymentMethod: orderPayload.paymentMethod,
    items: normalizedItems,
    subtotal,
    taxAmount,
    deliveryFee,
    totalAmount,
    status: "confirmed",
  });
};

const getOrders = async (userId) =>
  Order.find({ userId }).sort({ createdAt: -1 });

module.exports = {
  createOrder,
  getOrders,
};

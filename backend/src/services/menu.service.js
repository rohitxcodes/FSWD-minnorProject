const Menu = require("../models/menu.model");

const createMenu = async (menuData) =>
  Menu.create({
    name: menuData.name,
    description: menuData.description,
    price: Number(menuData.price),
  });

const getMenu = async (filters = {}) => {
  const query = {};

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};

    if (filters.minPrice !== undefined) {
      query.price.$gte = Number(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query.price.$lte = Number(filters.maxPrice);
    }
  }

  return Menu.find(query).sort({ createdAt: -1 });
};

const createOrderConfirmation = async (menuId) => {
  const menuItem = await Menu.findById(menuId);

  if (!menuItem) {
    const error = new Error("Menu item not found");
    error.status = 404;
    throw error;
  }

  return {
    menuId: menuItem._id,
    name: menuItem.name,
    price: menuItem.price,
    confirmedAt: new Date().toISOString(),
    message: `Order confirmed for ${menuItem.name}`,
  };
};

module.exports = {
  createMenu,
  getMenu,
  createOrderConfirmation,
};

const menuService = require("../services/menu.service");

const createMenu = async (req, res, next) => {
  try {
    const menuItem = await menuService.createMenu(req.body);

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    return next(error);
  }
};

const getMenu = async (req, res, next) => {
  try {
    const menuItems = await menuService.getMenu(req.query);

    return res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const confirmation = await menuService.createOrderConfirmation(
      req.params.menuId,
    );

    return res.status(200).json({
      success: true,
      message: confirmation.message,
      data: confirmation,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createMenu,
  getMenu,
  createOrder,
};

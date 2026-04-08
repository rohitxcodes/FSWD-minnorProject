const consumerService = require("../services/consumer.service");

const createConsumer = async (req, res, next) => {
  try {
    const consumer = await consumerService.createConsumer(req.body);

    return res.status(201).json({
      success: true,
      message: "Consumer registered successfully",
      data: consumer,
    });
  } catch (error) {
    return next(error);
  }
};

const getConsumers = async (req, res, next) => {
  try {
    const consumers = await consumerService.getConsumers();

    return res.status(200).json({
      success: true,
      data: consumers,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createConsumer,
  getConsumers,
};

const Consumer = require("../models/consumer.model");

const createConsumer = async (consumerData) => {
  const normalizedEmail = consumerData.email.toLowerCase();
  const existingConsumer = await Consumer.findOne({ email: normalizedEmail });

  if (existingConsumer) {
    const error = new Error("Consumer email already exists");
    error.status = 409;
    throw error;
  }

  return Consumer.create({
    name: consumerData.name,
    email: normalizedEmail,
    phone: consumerData.phone,
  });
};

const getConsumers = async () => Consumer.find().sort({ createdAt: -1 });

module.exports = {
  createConsumer,
  getConsumers,
};

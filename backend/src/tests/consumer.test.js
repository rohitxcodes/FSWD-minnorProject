jest.mock("../models/consumer.model", () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
}));

const Consumer = require("../models/consumer.model");
const consumerService = require("../services/consumer.service");

describe("consumer service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a consumer", async () => {
    Consumer.findOne.mockResolvedValue(null);
    Consumer.create.mockResolvedValue({
      name: "Asha",
      email: "asha@example.com",
      phone: "9999999999",
    });

    const result = await consumerService.createConsumer({
      name: "Asha",
      email: "asha@example.com",
      phone: "9999999999",
    });

    expect(Consumer.findOne).toHaveBeenCalledWith({
      email: "asha@example.com",
    });
    expect(Consumer.create).toHaveBeenCalledWith({
      name: "Asha",
      email: "asha@example.com",
      phone: "9999999999",
    });
    expect(result.email).toBe("asha@example.com");
  });

  test("throws when consumer email already exists", async () => {
    Consumer.findOne.mockResolvedValue({
      email: "asha@example.com",
    });

    await expect(
      consumerService.createConsumer({
        name: "Asha",
        email: "asha@example.com",
        phone: "9999999999",
      }),
    ).rejects.toMatchObject({ status: 409 });
  });

  test("fetches consumers", async () => {
    const consumers = [{ name: "Asha" }, { name: "Rohit" }];
    Consumer.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(consumers),
    });

    const result = await consumerService.getConsumers();

    expect(result).toEqual(consumers);
    expect(Consumer.find).toHaveBeenCalledTimes(1);
  });
});

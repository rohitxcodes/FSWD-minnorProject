jest.mock("../models/menu.model", () => ({
  find: jest.fn(),
  create: jest.fn(),
}));

const Menu = require("../models/menu.model");
const menuService = require("../services/menu.service");

describe("menu service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("adds a menu item", async () => {
    Menu.create.mockResolvedValue({
      name: "Paneer Tikka",
      description: "Charred paneer with spices",
      price: 320,
    });

    const result = await menuService.createMenu({
      name: "Paneer Tikka",
      description: "Charred paneer with spices",
      price: 320,
    });

    expect(Menu.create).toHaveBeenCalledWith({
      name: "Paneer Tikka",
      description: "Charred paneer with spices",
      price: 320,
    });
    expect(result.price).toBe(320);
  });

  test("fetches filtered menu items", async () => {
    const filteredItems = [
      { name: "Starter Platter", price: 180 },
      { name: "Grill Bowl", price: 260 },
    ];

    Menu.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(filteredItems),
    });

    const result = await menuService.getMenu({ minPrice: 150, maxPrice: 300 });

    expect(Menu.find).toHaveBeenCalledWith({
      price: { $gte: 150, $lte: 300 },
    });
    expect(result).toEqual(filteredItems);
  });

  test("fetches all menu items when no filters are provided", async () => {
    const allItems = [{ name: "Soup" }];

    Menu.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(allItems),
    });

    const result = await menuService.getMenu();

    expect(Menu.find).toHaveBeenCalledWith({});
    expect(result).toEqual(allItems);
  });
});

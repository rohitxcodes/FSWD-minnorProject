const MENU_IMAGE_MAP = {
  "Butter Chicken": "https://loremflickr.com/960/640/butter,chicken?lock=101",
  "Paneer Tikka": "https://loremflickr.com/960/640/paneer,tikka?lock=102",
  Biryani: "https://loremflickr.com/960/640/biryani,indian-food?lock=103",
  "Masala Dosa": "https://loremflickr.com/960/640/dosa,indian-food?lock=104",
  "Chole Bhature": "https://loremflickr.com/960/640/chole,bhature?lock=105",
  "Rajma Chawal": "https://loremflickr.com/960/640/rajma,rice?lock=106",
  "Palak Paneer": "https://loremflickr.com/960/640/palak,paneer?lock=107",
  "Tandoori Chicken":
    "https://loremflickr.com/960/640/tandoori,chicken?lock=108",
  "Pav Bhaji": "https://loremflickr.com/960/640/pav,bhaji?lock=109",
  Samosa: "https://loremflickr.com/960/640/samosa,snack?lock=110",
  "Aloo Paratha":
    "https://loremflickr.com/960/640/paratha,indian-food?lock=111",
  "Dal Makhani": "https://loremflickr.com/960/640/dal,makhani?lock=112",
  "Fish Curry": "https://loremflickr.com/960/640/fish,curry?lock=113",
  "Hyderabadi Biryani":
    "https://loremflickr.com/960/640/hyderabadi,biryani?lock=114",
  "Kadai Paneer": "https://loremflickr.com/960/640/kadai,paneer?lock=115",
  "Veg Pulao": "https://loremflickr.com/960/640/pulao,rice?lock=116",
  "Chicken Curry": "https://loremflickr.com/960/640/chicken,curry?lock=117",
  "Mutton Rogan Josh": "https://loremflickr.com/960/640/mutton,curry?lock=118",
  "Idli Sambhar": "https://loremflickr.com/960/640/idli,sambar?lock=119",
  "Gulab Jamun": "https://loremflickr.com/960/640/gulab,jamun?lock=120",
};

const toSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getSampleFoodImage = (menuName = "") => {
  if (MENU_IMAGE_MAP[menuName]) {
    return MENU_IMAGE_MAP[menuName];
  }

  const slug = toSlug(menuName);
  return `https://loremflickr.com/960/640/${slug || "indian-food"},food?lock=999`;
};

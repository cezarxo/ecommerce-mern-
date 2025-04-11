const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        status: false,
        message: "Keyword is required",
      });
    }
    const regex = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regex },
        { description: regex },
        { brand: regex },
        { category: regex },
      ],
    };
    const searchResults = await Product.find(createSearchQuery);

    return res.status(200).json({
      status: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  searchProducts,
};

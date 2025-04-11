const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");
const Order = require("../../models/Orders");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, review, rating } = req.body;

    const order = await Order.findOne({
      userId: userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to buy this product to review it",
      });
    }

    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });
    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      review,
      rating,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalRating = review.length;
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalRating;

    await Product.findByIdAndUpdate(productId, { averageRating });

    return res.status(201).json({
      success: true,
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId });

    return res.status(200).json({
      success: true,
      data:reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addProductReview, getProductReviews };

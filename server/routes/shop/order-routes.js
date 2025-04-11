const express = require("express");
const {
  createOrder,
  captureOrder,
  getAllOrders,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", captureOrder);
router.get("/list/:userId", getAllOrders);
router.get("/details/:id", getOrderDetails);

module.exports = router;

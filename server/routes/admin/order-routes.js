const express = require("express");
const { getAllOrders, getOrderDetails, updateOrderStatus } = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/get", getAllOrders);
router.get("/details/:id", getOrderDetails);
router.put("/update/:id", updateOrderStatus);

module.exports = router;

const paypal = require("../../helpers/paypal");
const Order = require("../../models/Orders");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      address,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdatedDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Payment for order",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error creating payment",
        });
      } else {
        const newCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          address,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdatedDate,
          paymentId,
          payerId,
        });
        await newCreatedOrder.save();

        const approvalURL = payment.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        return res.status(200).json({
          success: true,
          approvalURL,
          orderId: newCreatedOrder._id,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

const captureOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for(let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;
      
      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order confirmed successfully",
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error capturing order",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting all orders",
      error: error.message,
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting order details",
      error: error.message,
    });
  }
};
module.exports = {
  createOrder,
  captureOrder,
  getAllOrders,
  getOrderDetails,
};

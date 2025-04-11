import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import CartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";

export default function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shoppingOrder);
  const [currSelectedAddress, setCurrSelectedAddress] = useState(null);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const dispatch = useDispatch();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              item?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (!cartItems?.items || cartItems?.items?.length === 0) {
      toast.error("Please add items to cart to proceed with payment");
      return;
    }
    if (!currSelectedAddress) {
      toast.error("Please select an address to proceed with payment");
      return;
    }
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((cartItem) => ({
        productId: cartItem?.productId,
        title: cartItem?.title,
        image: cartItem?.image,
        price: cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price,
        quantity: cartItem?.quantity,
      })),
      address: {
        addressId: currSelectedAddress?._id,
        address: currSelectedAddress?.address,
        city: currSelectedAddress?.city,
        pincode: currSelectedAddress?.pincode,
        phone: currSelectedAddress?.phone,
        notes: currSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdatedDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "Order Data");
      if (data?.payload?.success) {
        setIsPaymentInitiated(true);
      } else {
        setIsPaymentInitiated(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="checkout"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5 ">
        <Address
          selectedId={currSelectedAddress}
          setCurrSelectedAddress={setCurrSelectedAddress}
        />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4">
            {cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items.map((item) => (
                  <CartItemsContent cartItem={item} key={item.productId} />
                ))
              : null}
            <div className="mt-8 space-y-4">
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 w-full">
              <Button onClick={handleInitiatePaypalPayment} className="w-full">
                {isPaymentInitiated
                  ? "Proccessing Payment..."
                  : "Checkout with PayPal"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

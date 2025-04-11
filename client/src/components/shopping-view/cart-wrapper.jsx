import React from "react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import CartItemsContent from "./cart-items-content";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function CartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              item?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
        <SheetDescription>
          You have {cartItems.length} items in your cart.
        </SheetDescription>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItems.length > 0
          ? cartItems.map((item) => (
              <CartItemsContent key={item.productId} cartItem={item} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>
      <Button
        className="w-full mt-6"
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

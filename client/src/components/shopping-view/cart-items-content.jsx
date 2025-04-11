import { Minus, Plus, Trash } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty } from "@/store/shop/cart-slice";
import { toast } from "sonner";

export default function CartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { productList } = useSelector((state) => state.shopProducts);

  function handleCartItemDelete(cartItems) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: cartItems?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item deleted");
      }
    });
  }

  function handleUpdateQty(cartItem, action) {
    if (action === "plus") {
      let getCartItem = cartItems.items || [];

      if (getCartItem.length) {
        const indexOfCurrentCartItem = getCartItem.findIndex(
          (item) => item.productId === cartItem?.productId
        );
        const getCurrentProductIndex = productList.findIndex(product=> product?._id === cartItem?.productId);
        const getTotalStock = productList[getCurrentProductIndex]?.totalStock;
        if (indexOfCurrentCartItem > -1) {
          const getQty = getCartItem[indexOfCurrentCartItem].quantity;

          if (getQty + 1 > getTotalStock) {
            toast.error(
              `Only ${getQty} can be added for this product`
            );
            return;
          }
        }
      }
    }
    dispatch(
      updateCartItemQty({
        userId: user?.id,
        productId: cartItem?.productId,
        quantity:
          action === "plus" ? cartItem?.quantity + 1 : cartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart updated successfully");
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center mt-2 gap-2">
          <Button
            className="w-8 h-8 rounded-full"
            variant="outline"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQty(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            className="w-8 h-8 rounded-full"
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQty(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

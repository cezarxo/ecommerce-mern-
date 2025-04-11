import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [dispatch, keyword, setSearchParams]);

  function handleGetProductDetails(getProductId) {
    dispatch(fetchProductDetails(getProductId));
  }

  function handleAddToCart(getProductId, getTotalStock) {
    let getCartItem = cartItems.items || [];

    if (getCartItem.length) {
      const indexOfCurrentItem = getCartItem.findIndex(
        (item) => item.productId === getProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQty = getCartItem[indexOfCurrentItem].quantity;
        
        if (getQty + 1 > getTotalStock) {
          toast.error(`Only ${getTotalStock} can be added for this product`);
          return;
        }
      }
    }
    dispatch(
      addToCart({ userId: user?.id, productId: getProductId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      setOpen(true);
    }
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            key={item._id}
            handleAddToCart={handleAddToCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailsDialog
         open={open}
         setOpen={setOpen}
        productDetails={productDetails}
      />
    </div>
  );
}

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsSlice from "./admin/products-slice";
import ShoppingProductSlice from "./shop/products-slice";
import ShoppingCartSlice from "./shop/cart-slice";
import ShopAddressSlice from "./shop/address-slice";
import ShopOrderSlice from "./shop/order-slice";
import AdminOrderSlice from "./admin/order-slice";
import ShopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import commonSlice from "./common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: AdminProductsSlice,
    adminOrder: AdminOrderSlice,
    shopProducts: ShoppingProductSlice,
    shoppingCart: ShoppingCartSlice,
    shopAddress: ShopAddressSlice,
    shoppingOrder: ShopOrderSlice,
    shopSearch: ShopSearchSlice,
    shopReview: shopReviewSlice,
    common: commonSlice,
  },
});

export default store;

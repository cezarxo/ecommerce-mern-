import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  ordersList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "shop/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/shop/order/create`,
      orderData
    );
    console.log(response.data, "Response Data");
    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "shop/capturePayment",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/shop/order/capture`,
      {
        paymentId,
        payerId,
        orderId,
      }
    );
    return response.data;
  }
);

export const getAllOrders = createAsyncThunk(
  "shop/getAllOrders",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/shop/order/list/${userId}`
    );
    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "shop/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/shop/order/details/${id}`
    );
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderId = null;
        state.approvalURL = null;
      }).addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      }).addCase(getAllOrders.fulfilled, (state, action  ) => {
        state.isLoading = false;
        state.ordersList = action.payload.data;
      }).addCase(getAllOrders.rejected, (state) => {
        state.isLoading = false;
        state.ordersList = [];
      }).addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      }).addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      }).addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;

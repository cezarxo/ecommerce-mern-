import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  ordersList: [],
  orderDetails: null,
};

export const getAllOrders = createAsyncThunk("shop/getAllOrders", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/admin/orders/get`
  );
  return response.data;
});

export const getOrderDetails = createAsyncThunk(
  "shop/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/admin/orders/details/${id}`
    );
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "shop/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/admin/orders/update/${id}`,
      { orderStatus }
    );
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
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

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "shop/addReview",
  async (reviewData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/shop/reviews/add`,
      reviewData
    );
    return response.data;
  }
);

export const getProductReviews = createAsyncThunk(
  "shop/getProductReviews",
  async (productId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/shop/reviews/${productId}`
    );
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getProductReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});
export default reviewSlice.reducer;

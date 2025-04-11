import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImgs: [],
};

export const getFeatureImgs = createAsyncThunk(
  "common/getFeatureImgs",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/common/feature/get`
    );
    return response.data;
  }
);

export const addFeatureImg = createAsyncThunk(
  "common/addFeatureImg",
  async (image) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/common/feature/add`,
      { image }
    );
    return response.data;
  }
);

export const deleteFeatureImg = createAsyncThunk(
  "common/deleteFeatureImg",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/common/feature/delete/${id}`
    );
    return response.data;
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImgs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImgs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImgs = action.payload.data;
      })
      .addCase(getFeatureImgs.rejected, (state) => {
        state.isLoading = false;
        state.featureImgs = [];
      });
  },
});
export default commonSlice.reducer;

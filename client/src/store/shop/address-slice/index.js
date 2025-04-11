import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  addressList: [],
  isLoading: false,
};

export const addNewAddress = createAsyncThunk(
  "address/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/shop/address/add`,
      formData
    );
    console.log(response.data);
    return response.data;
  }
);

export const fetchAddressList = createAsyncThunk(
  "address/fetchAddressList",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/shop/address/get/${userId}`
    );
    return response.data;
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/shop/address/update/${userId}/${addressId}`,
      formData
    );
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/shop/address/delete/${userId}/${addressId}`
    );
    return response.data;
  }
);

const shopAddressSlice = createSlice({
  name: "shopAddress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAddressList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddressList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAddressList.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default shopAddressSlice.reducer;

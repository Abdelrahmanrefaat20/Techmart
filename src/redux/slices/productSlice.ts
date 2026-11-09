import { ProductI } from "@/interfaces/product";
import apiServices from "@/services/apiServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState :{products:ProductI[]}= {
  products: [],
};

export const getallproducts = createAsyncThunk("products/getallproducts", async () => {
  const { data } = await apiServices.getProducts();
  return data;
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getallproducts.fulfilled, (state, action)=>{
      state.products=action.payload
    }).addCase(getallproducts.pending, (state, action)=>{
        console.log("pending");
        
    }).addCase(getallproducts.rejected, (state, action)=>{
                console.log("rejected");

    })
  },
});

export const ProductSlice = productSlice.reducer;

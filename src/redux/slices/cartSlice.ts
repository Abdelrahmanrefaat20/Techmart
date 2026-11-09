import apiServices from "@/services/apiServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  numberOfCartItems: number  ;
  isLoading: boolean;
}

const initialState: CartState = {
  numberOfCartItems: 0,
  isLoading: true,
};

export const fetchCartCount = createAsyncThunk<number, string>(
  "cart/fetchCartCount",
  async (token) => {
    const response = await apiServices.getUserCart(token);
    return response?.numOfCartItems ?? 0;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setNumberOfCartItems: (state, action: PayloadAction<number>) => {
      state.numberOfCartItems = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCartCount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.numberOfCartItems = action.payload;

        
        state.isLoading = false;
      })
      .addCase(fetchCartCount.rejected, (state) => {
        state.numberOfCartItems = 0;
        state.isLoading = false;
      });
  },
});

export const { setNumberOfCartItems } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
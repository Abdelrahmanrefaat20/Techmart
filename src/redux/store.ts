// redux toolkit

import { configureStore } from "@reduxjs/toolkit";
import { CounterReducer } from "./slices/counterSlices";
import { ProductSlice } from "./slices/productSlice";
import { cartReducer } from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
   counter: CounterReducer,
   prodcut: ProductSlice,
   cart: cartReducer
  },
});


store.getState()


export type RootState= ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch;
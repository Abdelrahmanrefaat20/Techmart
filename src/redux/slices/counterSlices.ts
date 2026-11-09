import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count++;
    },
    decrement: (state) => {
      state.count--;
    },
     incrementby: (state, action) => {
      state.count+=action.payload;
    },
  },
});

export const CounterReducer = counterSlice.reducer;
 export const {increment , decrement , incrementby} = counterSlice.actions   // action creator
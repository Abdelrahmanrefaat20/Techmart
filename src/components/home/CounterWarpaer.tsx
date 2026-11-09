"use client";

import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { decrement, increment, incrementby } from "@/redux/slices/counterSlices";
import { Dispatch } from "./../../../node_modules/redux/src/types/store";

export default function CounterWarpaer() {
  const { count } = useSelector((state: RootState) => state.counter);

  const Dispatch = useDispatch();
    return(

  <>
    <h1>{count}</h1>
    <Button onClick={() => Dispatch(increment())}>increment </Button>
    <Button onClick={() => Dispatch(decrement())}>decrement </Button>
    <Button onClick={() => Dispatch(incrementby(5))}>incrementby </Button>
  </>

    );


}

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchCartCount, setNumberOfCartItems } from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import apiServices from "@/services/apiServices";

export default function CartSync() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();

  const token = session?.user?.token;

  useEffect(() => {
    if (status === "loading") return;

    if (!token) {
      dispatch(setNumberOfCartItems(0));
      return;
    }
    dispatch(fetchCartCount(token));
  }, [token, status, dispatch]);

  return null;
}

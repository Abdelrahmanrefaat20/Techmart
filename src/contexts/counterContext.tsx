"use client";

import apiServices from "@/services/apiServices";
import { useSession } from "next-auth/react";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface CounterContextType {
  NumberOfCartItem: number;
  setNumberOfCartItem: React.Dispatch<React.SetStateAction<number>>;

}

export const counterContext = createContext<CounterContextType>({
  NumberOfCartItem: 0,
  setNumberOfCartItem: () => {},
});

export default function CounterContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [NumberOfCartItem, setNumberOfCartItem] = useState(0);
  const { data: session, status } = useSession();
  const token = session?.user?.token;

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!token) {
      setNumberOfCartItem(0);
      return;
    }

    apiServices
      .getUserCart(token)
      .then((response) => setNumberOfCartItem(response?.numOfCartItems ?? 0))
      .catch(() => setNumberOfCartItem(0));

  }, [token, status]);

  return (
    <counterContext.Provider
      value={{ NumberOfCartItem, setNumberOfCartItem  }}
    >
      {children}
    </counterContext.Provider>
  );
}

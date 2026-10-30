
import apiServices from "@/services/apiServices";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface CounterContextType {
  NumberOfCartItem: number;
  setNumberOfCartItem: React.Dispatch<React.SetStateAction<number>>;
}

export const counterContext = createContext<CounterContextType | null>(null);



export default function CounterContextProvider({children}:{children:ReactNode}) {
  const [NumberOfCartItem, setNumberOfCartItem] = useState(0);

  async function getUserCart() {
    const response = await apiServices.getUserCart();
      setNumberOfCartItem(response.numOfCartItems);
  }

  useEffect(() => {
    getUserCart();
  }, []); 

  return (
    <counterContext.Provider
      value={{ NumberOfCartItem, setNumberOfCartItem }}
    >
      {children}
    </counterContext.Provider>
  );
}

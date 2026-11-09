"use client";

import Footer from "@/components/layout/Footer/Footer";
import RouteTransition from "@/components/layout/Loading/RouteTransition";
import Navbar from "@/components/layout/Navbar/navbar";
import { Toaster } from "@/components/ui/toast";
import CartSync from "@/contexts/CartSync";
import WishlistContextProvider from "@/contexts/WishlistContext";
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { ReactNode, Suspense } from "react";
import { Provider } from "react-redux";

export default function MainProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
        <Provider store={store}>
           <CartSync />
        <WishlistContextProvider>
          {/* <CounterContextProvider> */}
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <Suspense fallback={null}>
              <RouteTransition />
            </Suspense>
            {children}
            <Toaster />
            <Footer />
          {/* </CounterContextProvider> */}
        </WishlistContextProvider>
    </Provider>
      </SessionProvider>
  );
}

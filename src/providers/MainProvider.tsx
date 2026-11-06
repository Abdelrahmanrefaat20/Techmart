
"use client";

import Footer from "@/components/layout/Footer/Footer";
import RouteTransition from "@/components/layout/Loading/RouteTransition";
import Navbar from "@/components/layout/Navbar/navbar";
import { Toaster } from "@/components/ui/toast";
import CounterContextProvider from "@/contexts/counterContext";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode, Suspense } from "react";

export default function MainProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>

    <CounterContextProvider>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <Suspense fallback={null}>
        <RouteTransition />
      </Suspense>
      {children}
      <Toaster />
      <Footer />
    </CounterContextProvider>
    </SessionProvider>
  );
}

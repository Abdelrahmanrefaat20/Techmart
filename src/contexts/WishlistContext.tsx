"use client";

import { toast } from "@/components/ui/toast";
import apiServices from "@/services/apiServices";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
type WishlistContextType = {
  wishListProductId: string[];
  NumberOfWishlistItem: number;
  isWishlisted: (id: string) => boolean;
  isLoading: (id: string) => boolean;
  toggleWishlist: (id: string, title: string) => Promise<boolean>;
};

export const WishlistContext = createContext<WishlistContextType | null>(null);

export default function WishlistContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishListProductId, setWishListProductId] = useState<string[]>([]);
  const [isLoadingIds, setIsLoadingIds] = useState<string[]>([]);
  const { data: session, status } = useSession();
  const token = session?.user?.token;

  useEffect(() => {
    if (status === "loading") return;
    if (!token) {
      setWishListProductId([]);
      return;
    }
    async function getWishlist() {
      try {
        const response = await apiServices.getUserWishlist(token!);

        const productIds = response.data.map((product) => product._id);

        setWishListProductId(productIds);
      } catch (error) {
        console.log(error);
      }
    }

    getWishlist();
  }, [token, status]);
  function isWishlisted(id: string): boolean {
    return wishListProductId.includes(id);
  }

  function isLoading(id: string): boolean {
    return isLoadingIds.includes(id);
  }

  async function toggleWishlist(id: string, title: string): Promise<boolean> {
    if (!token) {
      toast.add({
        title: "Please sign in",
        description: "Sign in to manage your wishlist.",
        type: "error",
      });
      return false;
    }

    if (isLoadingIds.includes(id)) return false;

    setIsLoadingIds((prev) => [...prev, id]);

   

    try {
      const response =   isWishlisted(id)
        ? await apiServices.removeProductFromWishlist(id, token)
        : await apiServices.addProductToWishlist(id, token);

      if (response.status !== "success") {
        toast.add({
          title: "Wishlist error",
          description: response.message || "Please try again.",
          type: "error",
        });
        return false;
      }

      if (isWishlisted(id)) {
        setWishListProductId((prev) =>
          prev.filter((productId) => productId !== id),
        );
      } else {
        setWishListProductId((prev) => [...prev, id]);
      }
      toast.add({
        title:   isWishlisted(id) ? "Removed from wishlist" : "Added to wishlist",
        description: title,
        type: "success",
      });

      return true;
    } catch (error) {
      console.log(error);

      toast.add({
        title: "Wishlist error",
        description: "Please try again.",
        type: "error",
      });

      return false;
    } finally {
      setIsLoadingIds((prev) => prev.filter((productId) => productId !== id));
    }
  }


  return (
<WishlistContext.Provider
  value={{
    wishListProductId,
    NumberOfWishlistItem: wishListProductId.length,
    isWishlisted,
    isLoading,
    toggleWishlist,
  }}
>
  {children}
</WishlistContext.Provider>
  );
}
export function useWishlist() {
  const context = useContext(WishlistContext);


  if (!context) {
    throw new Error("useWishlist must be used inside WishlistContextProvider");
  }

  return context;
}
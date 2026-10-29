"use client";
import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import apiServices from "@/services/apiServices";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function AddToCartBtn({ productId }: { productId: string }) {
  const [IsAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  async function addProductToCart() {
    setIsAddingToCart(true);
    try {
      const response = await apiServices.addProductToCart(productId);
      toast.add({
        title: response.status ?? response.statusMsg,
        description: response.message,
        type: "success",
      });
      setIsAddingToCart(false);
    } catch (error) {
      toast.add({
        title: "Failed to add product to cart",
        type: "error",
      });
      setIsAddingToCart(false);
    }
  }

  return (
    <Button onClick={addProductToCart} className="w-full shrink">
      {IsAddingToCart ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
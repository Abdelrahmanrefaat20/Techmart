"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import apiServices from "@/services/apiServices";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { counterContext } from "@/contexts/counterContext";

export default function AddToCartBtn({ productId }: { productId: string }) {
  const [IsAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const { setNumberOfCartItem } = useContext(counterContext);
  const { data: session } = useSession();
  const router = useRouter();

  async function addProductToCart() {
    const token = session?.user?.token;

    if (!token) {
      toast.add({
        title: "Please sign in",
        description: "You need an account to add items to your cart.",
        type: "error",
      });
      router.push("/auth/signin");
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await apiServices.addProductToCart(productId, token);
      setNumberOfCartItem(response?.numOfCartItems ?? 0);
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

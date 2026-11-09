"use client";

import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/WishlistContext";

type WishlistButtonProps = {
  productId: string;
  productTitle: string;
  variant?: "icon" | "full";
  className?: string;
};

export default function WishlistButton({
  productId,
  productTitle,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    isWishlisted,
    isLoading,
    toggleWishlist,
  } = useWishlist();

  const saved = isWishlisted(productId);
  const loading = isLoading(productId);

  async function handleWishlist() {
    if (!session?.user?.token) {
      toast.add({
        title: "Please sign in",
        description: "Sign in to save products to your wishlist.",
        type: "error",
      });

      router.push("/auth/signin");
      return;
    }

    const success = await toggleWishlist(productId, productTitle);

    // Refresh the server-rendered wishlist after removing an item.
    if (success && saved) {
      router.refresh();
    }
  }

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleWishlist}
        disabled={  loading}
        aria-pressed={saved}
        className={cn("w-full rounded-full px-6", className)}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Heart
            className={saved ? "fill-red-500 text-red-500" : ""}
          />
        )}

        {loading
          ? "Loading..."
          : saved
            ? "Remove from Wishlist"
            : "Wishlist"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading}
      aria-pressed={saved}
      aria-label={
        saved ? "Remove from wishlist" : "Add to wishlist"
      }
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur transition-all hover:scale-110 disabled:opacity-60",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <Heart
          className={cn(
            "size-5 transition-colors",
            saved && "fill-red-500 text-red-500",
          )}
        />
      )}
    </button>
  );
}
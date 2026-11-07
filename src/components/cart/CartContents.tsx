"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  Loader2,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartResponse } from "@/types/response";
import { Button } from "../ui/button";
import CartProduct from "./CartProduct";
import apiServices from "@/services/apiServices";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { counterContext } from "@/contexts/counterContext";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

export default function CartContents({
  cartResponse,
  error: initialError,
}: {
  cartResponse: CartResponse | null;
  error?: string;
}) {
  const router = useRouter();
  const [innerCartResponse, setInnerCartResponse] = useState(cartResponse);
  const products = innerCartResponse?.data.products ?? [];
  const [isClearing, setIsClearing] = useState(false);
  const { setNumberOfCartItem } = useContext(counterContext);
  const { data: session } = useSession();
  const token = session?.user?.token;

  useEffect(() => {
    setNumberOfCartItem(cartResponse?.numOfCartItems ?? 0);
    if (cartResponse != innerCartResponse) {
      setInnerCartResponse(cartResponse);
    }
  }, []);

  async function removeProductFromCart(productId: string) {
    const response = await apiServices.removeProductFromCart(productId, token);
    // setState => rerender
    setInnerCartResponse(response);
    setNumberOfCartItem(response?.numOfCartItems);
  }

  async function clearCart() {
    setIsClearing(true);
    const response = await apiServices.clearCart(token);
    // setState => rerender
    setInnerCartResponse(response);
    setIsClearing(false);
    setNumberOfCartItem(0);
  }
  async function updateProductCount(productId: string, count: number) {
    const response = await apiServices.UpdateCartProductQuantity(
      productId,
      count,
      token,
    );
    setInnerCartResponse(response);
  }

  return (
    <main className="min-h-[60vh] bg-[#faf9f6] text-[#171717]">
      <div className="container px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:pb-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-neutral-500"
        >
          <Link
            href="/"
            className={`transition-colors hover:text-black ${focus}`}
          >
            Home
          </Link>
          <ChevronRight size={15} aria-hidden="true" />
          <span aria-current="page" className="text-neutral-900">
            Cart
          </span>
        </nav>
        <div className="mb-7 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="text-3xl font-medium tracking-[-0.06em] sm:text-4xl lg:text-[42px]">
            YOUR CART
          </h1>
          <span aria-live="polite" className="text-sm text-neutral-500">
            {innerCartResponse?.numOfCartItems}{" "}
            {innerCartResponse?.numOfCartItems === 1 ? "item" : "items"}
          </span>
        </div>

        {initialError && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            <p>{initialError}</p>
            {initialError && (
              <button
                onClick={() => router.refresh()}
                className={`font-semibold underline ${focus}`}
              >
                Try again
              </button>
            )}
          </div>
        )}

        {products.length === 0 ? (
          !initialError && (
            <div className="flex flex-col items-center rounded-3xl border border-neutral-200 px-6 py-20 text-center">
              <span className="mb-5 rounded-full bg-white p-5">
                <ShoppingBag size={32} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                Your cart is waiting
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Discover something you love and add it here.
              </p>
              <Link
                href="/products"
                className={`mt-7 flex items-center gap-4 rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 ${focus}`}
              >
                Explore products <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          )
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)] lg:gap-6">
            <section
              aria-label="Cart products"
              className="rounded-[22px] border border-neutral-200 px-4 sm:px-6"
            >
              <ul className="divide-y divide-neutral-200/80">
                {products.map(({ _id, count, price, product }) => (
                  <CartProduct
                    key={_id}
                    count={count}
                    price={price}
                    product={product}
                    removeProductFromCart={removeProductFromCart}
                    updateProductCount={updateProductCount}
                  />
                ))}
              </ul>
            </section>

            <aside
              aria-label="Order summary"
              className="rounded-[22px] border border-neutral-200 p-5 sm:p-6"
            >
              <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
                Order Summary
              </h2>
              <dl className="space-y-4 text-sm sm:text-base">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-neutral-500">Subtotal</dt>
                  <dd className="font-semibold">
                    {formatPrice(innerCartResponse?.data?.totalCartPrice ?? 0)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-neutral-500">Delivery fee</dt>
                  <dd className="text-sm text-neutral-500">
                    Calculated at checkout
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-5">
                  <dt className="font-medium">Total</dt>
                  <dd
                    className="text-xl font-semibold tracking-tight sm:text-2xl"
                    aria-live="polite"
                  >
                    {formatPrice(innerCartResponse?.data?.totalCartPrice ?? 0)}
                  </dd>
                </div>
              </dl>
              <p className="mt-1 text-right text-xs text-neutral-500">
                Before delivery
              </p>
              {/* <div className="mt-6 flex gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-4">
                  <Tag
                    size={19}
                    className="shrink-0 text-neutral-400"
                    aria-hidden="true"
                  />
                  <input
                    aria-label="Promo code"
                    aria-describedby="promo-note"
                    disabled
                    placeholder="Add promo code"
                    className="h-11 w-full min-w-0 bg-transparent text-sm placeholder:text-neutral-400 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="button"
                  disabled
                  className="rounded-full bg-black px-6 text-sm text-white opacity-40 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
              <p id="promo-note" className="mt-2 px-1 text-xs text-neutral-500">
                Promo codes are not available yet.
              </p> */}
              <Link
                href={"/checkout/"+ cartResponse?.cartId}
                aria-disabled
                type="button"
                aria-describedby="checkout-note"
                className="mt-5 flex min-h-13 w-full items-center justify-center gap-4 rounded-full bg-black px-5 text-sm font-medium text-white opacity-50 disabled:cursor-not-allowed"
              >
                Go to Checkout <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <p
                id="checkout-note"
                className="mt-2 text-center text-xs text-neutral-500"
              >
                Checkout is coming soon.
              </p>
            </aside>
          </div>
        )}

        {products.length > 0 && (
          <>
            <br />
            <br />

            <Button variant="outline" onClick={clearCart}>
              {isClearing ? (
                <>
                  Clearing
                  <Loader2
                    className="animate-spin"
                    size={19}
                    aria-hidden="true"
                  />
                </>
              ) : (
                <>
                  Clear
                  <Trash2 size={19} aria-hidden="true" />
                </>
              )}
            </Button>
            <br />
            <br />

            <Link
              href="/products"
              className={`mt-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black ${focus}`}
            >
              <ArrowRight size={16} className="rotate-180" aria-hidden="true" />{" "}
              Continue shopping
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

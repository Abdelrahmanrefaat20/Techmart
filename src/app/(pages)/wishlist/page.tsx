import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import {
  ArrowRight,
  Heart,
  LockKeyhole,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { authOptions } from "@/lib/authOptions";
import apiServices from "@/services/apiServices";
import ProductCard from "@/components/layout/Product/ProductCard";

export const metadata: Metadata = {
  title: "Wishlist · TechMart",
  description: "The TechMart picks you saved for later.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d2c26]";

const focusOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1f391]";

const panelClass =
  "flex flex-col items-center justify-center gap-3 rounded-[26px] border border-dashed border-neutral-300 bg-white px-6 py-20 text-center";

const primaryButtonClass = `inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1d2c26] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2b4136] ${focusOnDark}`;

const secondaryButtonClass = `inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium transition-colors hover:border-neutral-400 ${focus}`;

const numberFormatter = new Intl.NumberFormat("en-US");

export default function WishlistPage() {
  return (
    <main id="main-content" className="flex-1 bg-[#faf9f6] text-[#171717]">
      <Suspense fallback={<WishlistSkeleton />}>
        <WishlistContent />
      </Suspense>
    </main>
  );
}

async function WishlistContent() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  const wishlist = token
    ? await apiServices.getUserWishlist(token).catch(() => null)
    : null;

  const products = wishlist?.data ?? [];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#1d2c26] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[#d1f391]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-[#63893d]/30 blur-3xl"
        />

        <div className="container relative px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
            <Heart size={14} className="text-[#d1f391]" aria-hidden="true" />
            Your wishlist
          </span>

          <h1 className="mt-6 max-w-2xl text-balance text-3xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Saved for{" "}
            <span className="font-serif font-normal italic text-[#d1f391]">
              later.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            Everything you loved, kept in one place. Tap the heart on a card to
            remove it, or add it straight to your cart.
          </p>

          {products.length > 0 && (
            <p className="mt-6 text-sm text-white/50">
              {numberFormatter.format(products.length)}{" "}
              {products.length === 1 ? "item" : "items"} saved
            </p>
          )}
        </div>
      </section>

      <section className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        {!token ? (
          <div className={panelClass}>
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <LockKeyhole size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold">
              Sign in to see your wishlist
            </h2>
            <p className="max-w-sm text-sm text-neutral-500">
              Your saved items live with your account, so sign in to pick up
              where you left off.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link href="/auth/signin" className={primaryButtonClass}>
                Sign in
              </Link>
              <Link href="/auth/signup" className={secondaryButtonClass}>
                Create an account
              </Link>
            </div>
          </div>
        ) : wishlist === null ? (
          <div className={panelClass}>
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <Heart size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold">
              We couldn&apos;t load your wishlist
            </h2>
            <p className="max-w-sm text-sm text-neutral-500">
              Something went wrong on the way to your saved items. Please try
              again.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link href="/wishlist" className={primaryButtonClass}>
                Try again
              </Link>
              <Link href="/products" className={secondaryButtonClass}>
                Browse products
              </Link>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className={panelClass}>
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <ShoppingBag size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold">Your wishlist is empty</h2>
            <p className="max-w-sm text-sm text-neutral-500">
              Nothing saved yet. Browse the shelves and tap the heart on
              anything worth coming back to.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link href="/products" className={primaryButtonClass}>
                <Sparkles size={15} aria-hidden="true" />
                Discover products
              </Link>
              <Link href="/categories" className={secondaryButtonClass}>
                Browse categories
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase">
                  Saved items
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Your picks
                </h2>
              </div>
              <Link
                href="/products"
                className={`group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-black ${focus}`}
              >
                Continue shopping
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <li key={product._id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

function WishlistSkeleton() {
  return (
    <>
      <div className="bg-[#1d2c26]">
        <div className="container px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="h-8 w-36 animate-pulse rounded-full bg-white/10" />
          <div className="mt-6 h-12 w-2/5 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>

      <div className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-6 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-7 w-52 animate-pulse rounded-full bg-neutral-200" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white"
            >
              <div className="aspect-square animate-pulse bg-neutral-100" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-10 w-full animate-pulse rounded-full bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  Sparkles,
  Tag,
  Layers,
} from "lucide-react";
import BrandGrid from "@/components/layout/Brand/BrandGrid";
import apiServices from "@/services/apiServices";

export const metadata: Metadata = {
  title: "Brands · TechMart",
  description:
    "Every brand on the techmart shelf — from everyday names to the ones worth saving up for.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d2c26]";

const focusOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1f391]";

const numberFormatter = new Intl.NumberFormat("en-US");

export default function Brands() {
  return (
    <main id="main-content" className="flex-1 bg-[#faf9f6] text-[#171717]">
      <Suspense fallback={<BrandsSkeleton />}>
        <BrandsContent />
      </Suspense>
    </main>
  );
}

async function BrandsContent() {
  const [brandsResult, productsResponse] = await Promise.all([
    apiServices.getBrands().catch(() => null),
    apiServices.getProducts().catch(() => null),
  ]);

  const brands = brandsResult?.data ?? [];
  const products = productsResponse?.data ?? [];
  const brandCount = brandsResult?.results ?? brands.length;
  const productCount = productsResponse?.results ?? products.length;

  const productCounts = products.reduce<Record<string, number>>(
    (counts, product) => {
      const id = product.brand?._id;
      if (id) {
        counts[id] = (counts[id] ?? 0) + 1;
      }
      return counts;
    },
    {},
  );

  const categoryCount = new Set(
    products.map((product) => product.category?._id).filter(Boolean),
  ).size;

  const featuredBrands = brands.slice(0, 6);
                     

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1d2c26] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[#d1f391]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-[#63893d]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
        />

        <div className="container relative px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
                <Tag size={14} className="text-[#d1f391]" aria-hidden="true" />
                Shop by brand
              </span>

              <h1 className="mt-6 max-w-2xl text-balance text-3xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                The names behind{" "}
                <span className="font-serif font-normal italic text-[#d1f391]">
                  the good stuff.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                Every label on our shelf, in one place. Find the names you
                already trust, and a few worth meeting.
              </p>

              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
                <div>
                  <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                    Brands
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums">
                    {numberFormatter.format(brandCount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                    Products
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums">
                    {numberFormatter.format(productCount)}
                  </dd>
                </div>
                {categoryCount > 0 && (
                  <div>
                    <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                      Categories
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold tabular-nums">
                      {categoryCount}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#brands-grid"
                  className={`group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#d1f391] px-6 text-sm font-semibold text-[#1d2c26] transition-colors hover:bg-[#e2ffb2] ${focusOnDark}`}
                >
                  Browse all brands
                  <ArrowRight
                    size={17}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                <Link
                  href="/products"
                  className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 ${focusOnDark}`}
                >
                  Shop all products
                </Link>
              </div>
            </div>

            {featuredBrands.length > 0 && (
              <div className="relative">
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {featuredBrands.map((brand) => (
                    <Link
                      key={brand._id}
                      
                      href={`/brands/${brand._id}`}
                      aria-label={brand.name}
                      className={`group flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 bg-white/95 p-3 transition-transform duration-300 hover:-translate-y-1 ${focusOnDark}`}
                    >
                      <Image
                        src={brand.image}
                        alt=""
                        width={160}
                        height={70}
                        sizes="(max-width: 1024px) 30vw, 14vw"
                        className="max-h-10 w-auto max-w-full object-contain opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100 sm:max-h-12"
                      />
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-[11px] tracking-[0.16em] text-white/40 uppercase">
                  A few of the names on the shelf
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand grid */}
      <section
        id="brands-grid"
        aria-labelledby="brands-title"
        className="container scroll-mt-24 px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase">
              All brands
            </p>
            <h2
              id="brands-title"
              className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Pick a name, find its shelf
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              {numberFormatter.format(brandCount)} brands, one search box. Tap
              a logo to see everything that brand brings.
            </p>
          </div>
          <Link
            href="/categories"
            className={`group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-black ${focus}`}
          >
            <Layers size={15} aria-hidden="true" />
            Browse categories
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[26px] border border-dashed border-neutral-300 bg-white px-6 py-20 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <Boxes size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">No brands to show yet</h3>
            <p className="max-w-sm text-sm text-neutral-500">
              {brandsResult
                ? "The shelf is being restocked. Check back soon."
                : "We couldn't load the brands right now. Please try again."}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link
                href="/brands"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1d2c26] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2b4136] ${focusOnDark}`}
              >
                Try again
              </Link>
              <Link
                href="/products"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium transition-colors hover:border-neutral-400 ${focus}`}
              >
                Browse products
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <BrandGrid brands={brands} productCounts={productCounts} />
        )}
      </section>

      {/* Closing call to action */}
      <section className="container px-5 pb-14 sm:px-8 lg:px-12 lg:pb-16">
        <div className="relative overflow-hidden rounded-[28px] bg-[#1d2c26] px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-[#d1f391]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-[#63893d]/30 blur-3xl"
          />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#d1f391] uppercase">
              Not sure which name to pick?
            </p>
            <h2 className="mt-3 max-w-xl text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Start with the shelf, not the logo.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/60">
              Browse by category and let the products introduce the brands.
            </p>
          </div>
          <div className="relative mt-7 flex flex-wrap gap-3 lg:mt-0">
            <Link
              href="/categories"
              className={`group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#d1f391] px-6 text-sm font-semibold text-[#1d2c26] transition-colors hover:bg-[#e2ffb2] ${focusOnDark}`}
            >
              <Layers size={17} aria-hidden="true" />
              Browse categories
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/products"
              className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 ${focusOnDark}`}
            >
              <Sparkles size={16} aria-hidden="true" />
              Shop all products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function BrandsSkeleton() {
  return (
    <>
      <div className="bg-[#1d2c26]">
        <div className="container px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="space-y-4">
              <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-white/10" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="h-16 w-full max-w-sm animate-pulse rounded-2xl bg-white/10" />
              <div className="flex gap-3">
                <div className="h-12 w-44 animate-pulse rounded-full bg-white/10" />
                <div className="h-12 w-36 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] animate-pulse rounded-2xl bg-white/10"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-6 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-7 w-64 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-4 w-80 animate-pulse rounded-full bg-neutral-200" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[22px] border border-neutral-200 bg-white p-3"
            >
              <div className="h-24 animate-pulse rounded-2xl bg-neutral-100 sm:h-28" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

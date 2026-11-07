import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Layers,
  Sparkles,
  Tag,
} from "lucide-react";
import apiServices from "@/services/apiServices";
import type { CategoryI } from "@/interfaces/product";

export const metadata: Metadata = {
  title: "Categories · TechMart",
  description:
    "Browse every techmart category, from everyday essentials to the upgrades you have been eyeing.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d2c26]";

const focusOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1f391]";

export default function Categories() {
  return (
    <main id="main-content" className="flex-1 bg-[#faf9f6] text-[#171717]">
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesContent />
      </Suspense>
    </main>
  );
}

async function CategoriesContent() {
  const [categoriesResponse, productsResponse] = await Promise.all([
    apiServices.getCategories().catch(() => null),
    apiServices.getProducts().catch(() => null),
  ]);

  const categories = categoriesResponse?.data ?? [];
  const products = productsResponse?.data ?? [];
  const productCount = productsResponse?.results ?? products.length;

  const productCounts = products.reduce<Record<string, number>>(
    (counts, product) => {
      const id = product.category?._id;
      if (id) {
        counts[id] = (counts[id] ?? 0) + 1;
      }
      return counts;
    },
    {},
  );

  const brandCount = new Set(
    products.map((product) => product.brand?._id).filter(Boolean),
  ).size;

  const imageFor = (category: CategoryI) =>
    category.image ||
    products.find((product) => product.category?._id === category._id)
      ?.imageCover;

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
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
            <Layers
              size={14}
              className="text-[#d1f391]"
              aria-hidden="true"
            />
            Browse the range
          </span>

          <h1 className="mt-6 max-w-2xl text-balance text-3xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Every category,{" "}
            <span className="font-serif font-normal italic text-[#d1f391]">
              one good place.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            From everyday essentials to the upgrades you have been eyeing.
            Start with the shelf that feels like you.
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                Categories
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {categories.length}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                Products
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {productCount}
              </dd>
            </div>
            {brandCount > 0 && (
              <div>
                <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                  Brands
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {brandCount}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Category grid */}
      <section
        aria-labelledby="categories-title"
        className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase">
              Shop by category
            </p>
            <h2
              id="categories-title"
              className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Find your kind of tech
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              Ten shelves, one place. Pick a lane and see where it takes you.
            </p>
          </div>
          <Link
            href="/products"
            className={`group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-black ${focus}`}
          >
            All products
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[26px] border border-dashed border-neutral-300 bg-white px-6 py-20 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <Boxes size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">No categories to show yet</h3>
            <p className="max-w-sm text-sm text-neutral-500">
              {categoriesResponse
                ? "The shelves are being restocked. Check back soon."
                : "We couldn't load the categories right now. Please try again."}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link
                href="/categories"
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const count = productCounts[category._id] ?? 0;
              const image = imageFor(category);

              return (
                <li key={category._id}>
                  <Link
                    href={`/categories/${category._id}`}
                    className={`group relative flex min-h-60 flex-col justify-end overflow-hidden rounded-[24px] border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_24px_50px_-30px_#1d2c2640] ${focus}`}
                  >
                    {image && (
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-[0.18] transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/10"
                    />

                    <span className="absolute top-5 right-5 z-10 flex size-10 items-center justify-center rounded-full bg-[#1d2c26] text-[#d1f391] transition-transform duration-300 group-hover:-translate-y-0.5">
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </span>

                    <div className="relative z-10">
                      <p className="text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {count > 0
                          ? `${count} ${count === 1 ? "product" : "products"}`
                          : "Explore category"}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#63893d]">
                        View category
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
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
              Not sure where to start?
            </p>
            <h2 className="mt-3 max-w-xl text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Browse everything, or let the brands lead.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/60">
              The full collection is one click away, and every good name is
              waiting on the brand shelf.
            </p>
          </div>
          <div className="relative mt-7 flex flex-wrap gap-3 lg:mt-0">
            <Link
              href="/products"
              className={`group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#d1f391] px-6 text-sm font-semibold text-[#1d2c26] transition-colors hover:bg-[#e2ffb2] ${focusOnDark}`}
            >
              <Sparkles size={17} aria-hidden="true" />
              Shop all products
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/brands"
              className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 ${focusOnDark}`}
            >
              <Tag size={16} aria-hidden="true" />
              Shop by brand
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoriesSkeleton() {
  return (
    <>
      <div className="bg-[#1d2c26]">
        <div className="container px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="mt-6 h-12 w-3/5 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
          <div className="mt-8 h-16 w-full max-w-md animate-pulse rounded-2xl bg-white/10" />
        </div>
      </div>

      <div className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-6 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-7 w-64 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-4 w-80 animate-pulse rounded-full bg-neutral-200" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-60 animate-pulse rounded-[24px] bg-neutral-200"
            />
          ))}
        </div>
      </div>
    </>
  );
}

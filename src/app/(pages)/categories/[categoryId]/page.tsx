import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ChevronRight,
  Layers,
  Package,
  Star,
  Tag,
} from "lucide-react";
import ProductCard from "@/components/layout/Product/ProductCard";
import apiServices from "@/services/apiServices";

const numberFormatter = new Intl.NumberFormat("en-US");

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d2c26]";

const focusOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1f391]";

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = await apiServices
    .getSpecificCategories(categoryId)
    .catch(() => null);

  if (!category?.data) {
    return { title: "Category · TechMart" };
  }

  return {
    title: `${category.data.name} · TechMart`,
    description: `Explore ${category.data.name} at TechMart — curated picks, top brands and everyday value.`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <main className="flex-1 bg-[#faf9f6] text-[#171717]">
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryDetails params={params} />
      </Suspense>
    </main>
  );
}

async function CategoryDetails({ params }: CategoryPageProps) {
  const { categoryId } = await params;

  const [categoryResult, productsResult, categoriesResult] = await Promise.all([
    apiServices.getSpecificCategories(categoryId).catch(() => null),
    apiServices.getProducts(1, categoryId).catch(() => null),
    apiServices.getCategories().catch(() => null),
  ]);

  const category = categoryResult?.data;

  if (!category) {
    notFound();
  }

  const products = productsResult?.data ?? [];
  const totalProducts = productsResult?.results ?? products.length;
  const brandCount = new Set(
    products.map((product) => product.brand?._id).filter(Boolean),
  ).size;
  const averageRating =
    products.length > 0
      ? products.reduce((sum, product) => sum + product.ratingsAverage, 0) /
        products.length
      : 0;

  const otherCategories = (categoriesResult?.data ?? [])
    .filter((item) => item._id !== category._id)
    .slice(0, 6);

  const categoryIndex = (categoriesResult?.data ?? []).findIndex(
    (item) => item._id === category._id,
  );

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
          className="pointer-events-none absolute -bottom-32 left-1/4 size-72 rounded-full bg-[#63893d]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
        />

        <div className="container relative px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-white/50"
          >
            <Link
              href="/"
              className={`rounded-sm transition-colors hover:text-white ${focusOnDark}`}
            >
              Home
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link
              href="/categories"
              className={`rounded-sm transition-colors hover:text-white ${focusOnDark}`}
            >
              Categories
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="line-clamp-1 text-white/80">{category.name}</span>
          </nav>

          <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
                <Layers size={14} className="text-[#d1f391]" aria-hidden="true" />
                Category
              </span>

              <h1 className="mt-5 max-w-2xl text-balance text-4xl leading-[1.02] font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {category.name}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                Every{" "}
                <span className="font-serif font-normal italic text-[#d1f391]">
                  {category.name.toLowerCase()}
                </span>{" "}
                pick in one shelf — the staples, the upgrades, and the things
                you did not know you needed.
              </p>

              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
                <div>
                  <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                    Products
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums">
                    {numberFormatter.format(totalProducts)}
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
                {averageRating > 0 && (
                  <div>
                    <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                      Avg. rating
                    </dt>
                    <dd className="mt-1 flex items-center gap-1.5 text-2xl font-semibold tabular-nums">
                      {averageRating.toFixed(1)}
                      <Star
                        size={16}
                        className="fill-[#d1f391] text-[#d1f391]"
                        aria-hidden="true"
                      />
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/products?category=${category._id}`}
                  className={`group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#d1f391] px-6 text-sm font-semibold text-[#1d2c26] transition-colors hover:bg-[#e2ffb2] ${focusOnDark}`}
                >
                  Shop this category
                  <ArrowRight
                    size={17}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/categories"
                  className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 ${focusOnDark}`}
                >
                  All categories
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] border border-white/10 bg-white/5">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/30">
                    <Boxes size={56} strokeWidth={1} aria-hidden="true" />
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1d2c26]/70 via-transparent to-transparent"
                />
                <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur">
                    <Package size={13} aria-hidden="true" />
                    {numberFormatter.format(totalProducts)} items
                  </span>
                  <span className="rounded-full bg-[#d1f391] px-3.5 py-2 text-xs font-semibold text-[#1d2c26]">
                    {String(categoryIndex + 1).padStart(2, "0")}/
                    {String(categoriesResult?.results ?? 0).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="absolute -top-4 -left-4 hidden size-16 rounded-full border border-[#d1f391]/30 lg:block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        id="category-products"
        aria-labelledby="category-products-title"
        className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase">
              In the shelf
            </p>
            <h2
              id="category-products-title"
              className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {products.length > 0
                ? `Inside ${category.name}`
                : `${category.name}, coming up`}
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              {products.length > 0
                ? `Showing ${numberFormatter.format(products.length)} of ${numberFormatter.format(totalProducts)} picks${brandCount > 0 ? ` from ${brandCount} ${brandCount === 1 ? "brand" : "brands"}` : ""}.`
                : "This shelf is being restocked — here is what is already waiting elsewhere."}
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

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[26px] border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <Boxes size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">
              No {category.name} products yet
            </h3>
            <p className="max-w-sm text-sm text-neutral-500">
              We are curating this shelf right now. In the meantime, the rest of
              the store is very much open.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className={`group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1d2c26] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2b4136] ${focusOnDark}`}
              >
                Shop all products
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/categories"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium transition-colors hover:border-neutral-400 ${focus}`}
              >
                Browse categories
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Keep exploring */}
      {otherCategories.length > 0 && (
        <section
          aria-labelledby="keep-exploring-title"
          className="container px-5 pb-14 sm:px-8 lg:px-12 lg:pb-16"
        >
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase">
                  Keep exploring
                </p>
                <h2
                  id="keep-exploring-title"
                  className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
                >
                  Other shelves worth a look
                </h2>
              </div>
              <Link
                href="/categories"
                className={`group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-black ${focus}`}
              >
                View all
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherCategories.map((item) => (
                <li key={item._id}>
                  <Link
                    href={`/categories/${item._id}`}
                    className={`group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-[#faf9f6] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white hover:shadow-[0_18px_40px_-30px_#1d2c2640] ${focus}`}
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-neutral-400">
                          <Tag size={18} aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-neutral-500">
                        View category
                      </span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-neutral-400 transition-colors group-hover:text-[#1d2c26]"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function CategorySkeleton() {
  return (
    <>
      <div className="bg-[#1d2c26]">
        <div className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="h-3 w-52 animate-pulse rounded-full bg-white/10" />
          <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="space-y-4">
              <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="h-14 w-4/5 animate-pulse rounded-2xl bg-white/10" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="h-20 w-full max-w-sm animate-pulse rounded-2xl bg-white/10" />
              <div className="flex gap-3">
                <div className="h-12 w-44 animate-pulse rounded-full bg-white/10" />
                <div className="h-12 w-36 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
            <div className="aspect-[4/3] animate-pulse rounded-[30px] bg-white/10" />
          </div>
        </div>
      </div>

      <div className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-6 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-7 w-64 animate-pulse rounded-full bg-neutral-200" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-square animate-pulse rounded-2xl bg-neutral-200" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

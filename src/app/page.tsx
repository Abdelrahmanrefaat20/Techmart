import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import apiServices from "@/services/apiServices";
import ProductCard from "@/components/layout/Product/ProductCard";
import type { BrandI, CategoryI } from "@/interfaces/product";
import { formatPrice } from "@/lib/utils";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

const focusOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1f391]";

const benefits = [
  {
    icon: Truck,
    title: "Fast delivery",
    text: "Straight to your door, across Egypt.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Your details stay private and safe.",
  },
  {
    icon: Banknote,
    title: "Cash on delivery",
    text: "Pay only when your order arrives.",
  },
  {
    icon: Sparkles,
    title: "Curated tech",
    text: "Only the upgrades worth your money.",
  },
];

export default async function Home() {
  const response = await apiServices.getProducts().catch(() => null);
  const products = response?.data ?? [];

  const featured = [...products].sort(
    (a, b) =>
      b.ratingsAverage - a.ratingsAverage || b.sold - a.sold,
  )[0];

  const trending = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 8);

  const categories = Array.from(
    new Map(
      products.map(
        (product) =>
          [product.category?._id, product.category] as const,
      ),
    ).values(),
  )
    .filter((category): category is CategoryI => Boolean(category?._id))
    .slice(0, 3);

  const brands = Array.from(
    new Map(
      products.map(
        (product) => [product.brand?._id, product.brand] as const,
      ),
    ).values(),
  )
    .filter((brand): brand is BrandI => Boolean(brand?._id))
    .slice(0, 10);

  const categoryCounts = products.reduce<Record<string, number>>(
    (counts, product) => {
      const id = product.category?._id;
      if (id) {
        counts[id] = (counts[id] ?? 0) + 1;
      }
      return counts;
    },
    {},
  );

  const totalProducts = response?.results ?? products.length;
  const brandsCount = new Set(
    products.map((product) => product.brand?._id).filter(Boolean),
  ).size;
  const categoriesCount = new Set(
    products.map((product) => product.category?._id).filter(Boolean),
  ).size;

  return (
    <main id="main-content" className="flex-1 bg-[#faf9f6] text-[#171717]">
      {/* Hero */}
      <section className="container px-5 pt-5 sm:px-8 sm:pt-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[#1d2c26] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#d1f391]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-[#63893d]/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
          />

          <div className="relative grid gap-10 px-6 py-10 sm:px-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-8 lg:gap-12 lg:px-14 lg:py-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
                <Sparkles size={14} className="text-[#d1f391]" aria-hidden="true" />
                New season picks
              </span>

              <h1 className="mt-6 max-w-xl text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-[52px]">
                Everyday tech,
                <br className="hidden sm:block" /> picked with care.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/65 sm:text-base">
                From the gadgets you have been eyeing to the essentials you did
                not know you needed. Find your next upgrade at techmart.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className={`group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#d1f391] px-6 text-sm font-semibold text-[#1d2c26] transition-colors hover:bg-[#e2ffb2] ${focusOnDark}`}
                >
                  Shop the collection
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/categories"
                  className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 ${focusOnDark}`}
                >
                  Browse categories
                </Link>
              </div>

              {totalProducts > 0 && (
                <dl className="mt-10 grid max-w-sm grid-cols-3 gap-4 border-t border-white/10 pt-6">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.12em] text-white/45">
                      Products
                    </dt>
                    <dd className="mt-1 text-xl font-semibold tracking-tight">
                      {totalProducts}+
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.12em] text-white/45">
                      Brands
                    </dt>
                    <dd className="mt-1 text-xl font-semibold tracking-tight">
                      {brandsCount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.12em] text-white/45">
                      Categories
                    </dt>
                    <dd className="mt-1 text-xl font-semibold tracking-tight">
                      {categoriesCount}
                    </dd>
                  </div>
                </dl>
              )}
            </div>

            {featured && (
              <div className="relative mx-auto w-full max-w-md lg:mt-0">
                <Link
                  href={`/products/${featured.id}`}
                  className={`group block rounded-[26px] border border-white/10 bg-white/5 p-3 backdrop-blur transition-colors hover:border-white/20 ${focusOnDark}`}
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-[18px] bg-[#f4f3ef]">
                    <Image
                      src={featured.imageCover}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#1d2c26] px-3 py-1 text-[11px] font-medium text-[#d1f391]">
                      Featured
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-4 px-2 pb-1 pt-4">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] uppercase tracking-[0.14em] text-white/45">
                        {featured.brand?.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white">
                        {featured.title}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#d1f391] px-3.5 py-2 text-xs font-semibold tabular-nums text-[#1d2c26]">
                      {formatPrice(featured.price)}
                    </span>
                  </div>
                </Link>

                <div className="absolute -right-2 top-6 flex items-center gap-1.5 rounded-full bg-[#d1f391] px-3 py-1.5 text-[11px] font-semibold text-[#1d2c26] shadow-lg">
                  <Star size={12} className="fill-current" aria-hidden="true" />
                  Top rated
                </div>

                <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-[#171717] shadow-xl">
                  <Star
                    size={16}
                    className="fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold tabular-nums">
                    {featured.ratingsAverage.toFixed(1)}
                  </span>
                  <span className="text-xs text-neutral-500">
                    ({featured.ratingsQuantity} reviews)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        aria-label="Why shop with techmart"
        className="container px-5 pt-6 sm:px-8 lg:px-12"
      >
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#faf9f6] text-[#1d2c26]">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#63893d]">
                Browse the range
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Shop by category
              </h2>
            </div>
            <Link
              href="/categories"
              className={`inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-black ${focus}`}
            >
              All categories
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {categories.map((category, index) => {
              const image =
                category.image ||
                products.find(
                  (product) => product.category?._id === category._id,
                )?.imageCover;

              return (
                <Link
                  key={category._id}
                  href="/categories"
                  className={`group relative flex min-h-52 flex-col justify-end overflow-hidden rounded-[22px] border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 ${focus}`}
                >
                  {image && (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover opacity-[0.14] transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/10"
                  />
                  <span className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-[#1d2c26] text-[#d1f391] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                  <div className="relative z-10">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                      0{index + 1}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {categoryCounts[category._id] ?? 0} products
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section className="container px-5 pb-12 sm:px-8 lg:px-12 lg:pb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#63893d]">
                Most loved
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Trending now
              </h2>
              <p className="mt-2 max-w-md text-sm text-neutral-500">
                The pieces our customers keep coming back for.
              </p>
            </div>
            <Link
              href="/products"
              className={`group inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:border-neutral-400 ${focus}`}
            >
              View all products
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <section className="container px-5 pb-12 sm:px-8 lg:px-12 lg:pb-16">
          <div className="flex flex-col gap-6 rounded-[22px] border border-neutral-200 bg-white px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#63893d]">
                Names you trust
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Shop by brand
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                The labels behind your everyday upgrades.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  href="/brands"
                  className={`rounded-full border border-neutral-200 bg-[#faf9f6] px-4 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-[#1d2c26] hover:bg-[#1d2c26] hover:text-[#d1f391] ${focus}`}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing call to action */}
      <section className="container px-5 pb-14 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[#1d2c26] px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#d1f391]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-[#63893d]/30 blur-3xl"
          />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d1f391]">
              Ready when you are
            </p>
            <h2 className="mt-3 max-w-xl text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Your next everyday upgrade is one click away.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/60">
              Browse the full collection and find something worth keeping.
            </p>
          </div>
          <Link
            href="/products"
            className={`group relative mt-7 inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-[#d1f391] px-6 text-sm font-semibold text-[#1d2c26] transition-colors hover:bg-[#e2ffb2] lg:mt-0 ${focusOnDark}`}
          >
            <Package size={18} aria-hidden="true" />
            Start shopping
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}

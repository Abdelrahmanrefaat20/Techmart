import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Compass,
  Home,
  MapPinOff,
  PackageSearch,
  ShoppingBag,
  SearchX,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found · TechMart",
  description: "The page you were looking for is not part of this collection.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d2c26]";

const focusOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1f391]";

const shortcuts = [
  {
    href: "/products",
    label: "All products",
    description: "Browse the full collection, from essentials to upgrades.",
    icon: ShoppingBag,
  },
  {
    href: "/categories",
    label: "Categories",
    description: "Find your kind of tech without the guesswork.",
    icon: Boxes,
  },
  {
    href: "/brands",
    label: "Brands",
    description: "Shop the names you already trust.",
    icon: Compass,
  },
];

export default function NotFound() {
  return (
    <main id="main-content" className="flex-1 bg-[#faf9f6] text-[#171717]">
      <section
        aria-labelledby="not-found-title"
        className="container px-5 py-8 sm:px-8 sm:py-12 lg:px-12"
      >
        <div className="relative isolate overflow-hidden rounded-[28px] bg-[#1d2c26] text-white">
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

          <div className="relative grid gap-12 px-6 py-12 sm:px-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center lg:px-14 lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
                <MapPinOff
                  size={14}
                  className="text-[#d1f391]"
                  aria-hidden="true"
                />
                404 — Page not found
              </span>

              <h1
                id="not-found-title"
                className="mt-6 max-w-xl text-balance text-4xl leading-[1.05] font-semibold tracking-[-0.05em] sm:text-5xl"
              >
                This page slipped
                <br className="hidden sm:block" /> out of the{" "}
                <span className="font-serif font-normal italic text-[#d1f391]">
                  catalogue.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/65 sm:text-base">
                The link may be broken, the page may have moved, or the product
                is simply gone. Either way, there is plenty more worth finding.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className={`group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#d1f391] px-6 text-sm font-semibold text-[#1d2c26] transition-colors hover:bg-[#e2ffb2] ${focusOnDark}`}
                >
                  <ShoppingBag size={17} aria-hidden="true" />
                  Back to shopping
                  <ArrowRight
                    size={17}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/"
                  className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 ${focusOnDark}`}
                >
                  <Home size={16} aria-hidden="true" />
                  Go home
                </Link>
              </div>

              <p className="mt-8 flex items-center gap-2 text-xs text-white/45">
                <ArrowLeft size={13} aria-hidden="true" />
                Or use your browser&apos;s back button to pick up where you left
                off.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[38px] bg-[#d1f391]/5 blur-2xl"
              />

              <div className="relative rounded-[30px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="relative overflow-hidden rounded-[22px] bg-[#f4f3ef] px-6 pt-10 pb-6 text-[#1d2c26]">
                  <span
                    aria-hidden="true"
                    className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full bg-[#1d2c26] text-[#d1f391]"
                  >
                    <SearchX size={16} />
                  </span>

                  <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7b8471] uppercase">
                    Search result
                  </p>

                  <p
                    aria-hidden="true"
                    className="mt-6 text-[92px] leading-none font-extrabold tracking-[-0.09em]"
                  >
                    4<span className="text-[#c9d9b3]">0</span>4
                  </p>

                  <p className="mt-4 text-sm font-semibold">
                    No match on this shelf.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#7b8471]">
                    The page you were looking for is not part of this
                    collection.
                  </p>

                  <div
                    aria-hidden="true"
                    className="mt-6 flex items-center justify-between border-t border-dashed border-[#cdd3c5] pt-4 text-[10px] font-medium tracking-[0.16em] text-[#8a927f] uppercase"
                  >
                    <span>TechMart</span>
                    <span>Not in stock</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
                  <span className="flex items-center gap-2">
                    <PackageSearch
                      size={14}
                      className="text-[#d1f391]"
                      aria-hidden="true"
                    />
                    Still looking?
                  </span>
                  <span className="font-medium text-white/40">
                    Try the collection
                  </span>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="absolute -top-4 -right-3 rotate-6 rounded-full bg-[#d1f391] px-3 py-1.5 text-[11px] font-semibold text-[#1d2c26] shadow-lg"
              >
                404
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="not-found-help"
        className="container px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase">
              Keep looking
            </p>
            <h2
              id="not-found-help"
              className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              A few good places to land
            </h2>
          </div>
          <Link
            href="/"
            className={`group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-black ${focus}`}
          >
            Back to home
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {shortcuts.map(({ href, label, description, icon: Icon }) => (
            <li key={href} className="h-full">
              <Link
                href={href}
                className={`group flex h-full items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-[#1d2c26] ${focus}`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#faf9f6] text-[#1d2c26] transition-colors group-hover:bg-[#1d2c26] group-hover:text-[#d1f391]">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    {label}
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-neutral-500">
                    {description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

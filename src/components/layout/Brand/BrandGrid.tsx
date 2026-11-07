"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, Tag, X } from "lucide-react";
import type { BrandI } from "@/interfaces/product";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d2c26]";

const numberFormatter = new Intl.NumberFormat("en-US");

export default function BrandGrid({
  brands,
  productCounts,
}: {
  brands: BrandI[];
  productCounts: Record<string, number>;
}) {
  const [query, setQuery] = useState("");

  const filteredBrands = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return brands;
    }

    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(needle) ||
        brand.slug.toLowerCase().includes(needle),
    );
  }, [brands, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brands"
            aria-label="Search brands"
            className={`h-11 w-full rounded-full border border-neutral-200 bg-white pr-10 pl-11 text-sm text-neutral-900 placeholder:text-neutral-400 transition-[border-color,box-shadow] duration-200 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10 focus:outline-none ${focus}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className={`absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 ${focus}`}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <p aria-live="polite" className="text-xs text-neutral-500">
          Showing {numberFormatter.format(filteredBrands.length)} of{" "}
          {numberFormatter.format(brands.length)} brands
        </p>
      </div>

      {filteredBrands.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-[26px] border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
            <Tag size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h3 className="text-lg font-semibold">No brands match “{query}”</h3>
          <p className="max-w-sm text-sm text-neutral-500">
            Try a shorter name, or clear the search to see every brand on the
            shelf.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1d2c26] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2b4136] ${focus}`}
          >
            Clear search
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredBrands.map((brand) => {
            const count = productCounts[brand._id] ?? 0;

            return (
              <li key={brand._id}>
                <Link
                  href={`/brands/${brand._id}`}
                  className={`group flex h-full flex-col overflow-hidden rounded-[22px] border border-neutral-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_24px_50px_-30px_#1d2c2640] ${focus}`}
                >
                  <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-[#faf9f6] sm:h-28">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background-image:radial-gradient(circle_at_50%_120%,#d1f39166,transparent_70%)]"
                    />
                    {brand.image ? (
                      <Image
                        src={brand.image}
                        alt=""
                        width={200}
                        height={80}
                        sizes="200px"
                        className="relative max-h-12 w-auto max-w-[72%] object-contain opacity-70 grayscale transition duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                    ) : (
                      <Tag
                        size={22}
                        aria-hidden="true"
                        className="text-neutral-300"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 items-end justify-between gap-2 px-1 pt-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold tracking-[-0.01em]">
                        {brand.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {count > 0
                          ? `${numberFormatter.format(count)} ${
                              count === 1 ? "product" : "products"
                            }`
                          : "Explore brand"}
                      </p>
                    </div>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1d2c26] text-[#d1f391] transition-transform duration-300 group-hover:-translate-y-0.5">
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

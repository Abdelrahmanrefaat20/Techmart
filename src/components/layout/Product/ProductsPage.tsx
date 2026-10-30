import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import apiServices from "@/services/apiServices";
import ProductCard from "./ProductCard";
import ProductsSkeleton from "./ProductsSkeleton";
import { ProductsPageProps } from "@/interfaces/product";

const numberFormatter = new Intl.NumberFormat("en-US");
export default async function ProductsPage(
) {


  return (
    <main className="flex-1 bg-muted/40">
      <section className="relative overflow-hidden bg-[#1d2c26] text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#d1f391]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-[#63893d]/30 blur-3xl" />

        <div className="container relative mx-auto px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <Badge className="mb-5 bg-[#d1f391] text-[#1d2c26] hover:bg-[#d1f391]">
            <Package data-icon="inline-start" />
            Shop the collection
          </Badge>

          <h1 className="max-w-2xl font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Good tech. Great possibilities.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
            Browse our full range of everyday upgrades, from the latest gadgets
            to the essentials you didn&apos;t know you needed.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
              Curated tech
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
              Top brands
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
              Everyday value
            </span>
          </div>
        </div>
      </section>

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsSection />
      </Suspense>
    </main>
  );
}

async function ProductsSection() {
  const { data: products, results } = await apiServices.getProducts();

  const brandsCount = new Set(products.map((product) => product.brand?._id))
    .size;
  const categoriesCount = new Set(
    products.map((product) => product.category?._id),
  ).size;

  return (
    <section
      id="main-content"
      className="container mx-auto px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-semibold sm:text-2xl">
            All products
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {numberFormatter.format(products.length)} of{" "}
            {numberFormatter.format(results)} items
            {brandsCount > 0 && ` · ${brandsCount} brands`}
            {categoriesCount > 0 && ` · ${categoriesCount} categories`}
          </p>
        </div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Browse categories
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed bg-background px-6 py-20 text-center">
          <Package className="size-10 text-muted-foreground" />
          <h3 className="font-heading text-lg font-semibold">No products yet</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            We couldn't find any products right now. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      
    </section>
  );
}

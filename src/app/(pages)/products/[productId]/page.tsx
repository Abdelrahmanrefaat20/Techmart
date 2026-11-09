import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/layout/Product/ProductGallery";
import apiServices from "@/services/apiServices";
import { cn } from "@/lib/utils";
import AddToCartBtn from "@/components/layout/Product/AddToCartBtn";
import WishlistButton from "@/components/layout/Product/WishlistButton";

const priceFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

type ProductDetailsPageProps = {
  params: Promise<{ productId: string }>;
};

const perks = [
  {
    icon: Truck,
    title: "Fast delivery",
    description: "Ships within 24 hours",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    description: "14-day return window",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Protected payments",
  },
];

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <main className="flex-1 bg-muted/40">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </main>
  );
}

async function ProductDetails({ params }: ProductDetailsPageProps) {
  const { productId } = await params;
  const result = await apiServices
    .getProductDetails(productId)
    .catch(() => null);

  if (!result?.data) {
    notFound();
  }

  const product = result.data;
  const images = [
    product.imageCover,
    ...product.images.filter((image) => image !== product.imageCover),
  ];
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity < 10;

  return (
    <div className="container mx-auto px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href="/products"
          className="transition-colors hover:text-foreground"
        >
          Products
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="line-clamp-1 text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category?.name}</Badge>
            <Badge variant="outline">{product.brand?.name}</Badge>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            {product.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-4",
                    index < Math.round(product.ratingsAverage)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/40",
                  )}
                />
              ))}
            </span>
            <span className="font-medium">
              {product.ratingsAverage.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({numberFormatter.format(product.ratingsQuantity)} reviews)
            </span>
            <span aria-hidden="true" className="text-muted-foreground">
              ·
            </span>
            <span className="text-muted-foreground">
              {numberFormatter.format(product.sold)} sold
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-heading text-3xl font-bold">
              {priceFormatter.format(product.price)}
            </span>
            <Badge
              variant={isOutOfStock ? "destructive" : "secondary"}
              className={cn(
                !isOutOfStock && "gap-1",
                isLowStock && "bg-amber-100 text-amber-800",
              )}
            >
              {isOutOfStock ? (
                "Out of stock"
              ) : isLowStock ? (
                `Only ${product.quantity} left`
              ) : (
                <>
                  <Check className="size-3" />
                  In stock
                </>
              )}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {numberFormatter.format(product.quantity)} available
            </span>
          </div>

          <div className="rounded-3xl border bg-card p-5">
            <h2 className="font-heading text-sm font-semibold tracking-wide uppercase">
              Product details
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {product.description?.trim() ||
                "No description available for this product."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <AddToCartBtn productId={product._id} />
            <WishlistButton
              productId={product._id}
              productTitle={product.title}
              variant="full"
            />{" "}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {perks.map((perk) => {
              const Icon = perk.icon;

              return (
                <div
                  key={perk.title}
                  className="flex items-start gap-3 rounded-2xl border bg-card p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eaf1e0] text-[#63893d]">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold">{perk.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {perk.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            variant="link"
            className="w-fit px-0"
            nativeButton={false}
            render={<Link href="/products" />}
          >
            Back to all products
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mb-6 h-4 w-64 animate-pulse rounded-full bg-muted" />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-3">
          <div className="aspect-square animate-pulse rounded-3xl bg-muted" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-8 w-3/4 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-52 animate-pulse rounded-full bg-muted" />
          <div className="h-9 w-40 animate-pulse rounded-full bg-muted" />
          <div className="h-40 animate-pulse rounded-3xl bg-muted" />
          <div className="flex gap-3">
            <div className="h-10 w-36 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ProductI } from "@/interfaces/product";
import { cn } from "@/lib/utils";
import AddToCartBtn from "./AddToCartBtn";
import apiServices from "@/services/apiServices";

const priceFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");




export default function ProductCard({ product }: { product: ProductI }) {
  const href = `/products/${product.id}`;
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity < 10;

  return (
    <Card className="group relative gap-0 overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={href}
        aria-label={product.title}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge
            variant="secondary"
            className="max-w-[85%] bg-background/90 text-foreground backdrop-blur"
          >
            <span className="truncate">{product.category?.name}</span>
          </Badge>

          {isOutOfStock && (
            <Badge variant="destructive" className="bg-background/90">
              Out of stock
            </Badge>
          )}
          {isLowStock && (
            <Badge
              variant="secondary"
              className="shrink-0 bg-amber-100 text-amber-800"
            >
              {product.quantity} left
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <p className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {product.brand?.name}
        </p>

        <Link
          href={href}
          className="line-clamp-2 min-h-10 font-heading text-sm font-semibold leading-5 transition-colors hover:text-primary"
        >
          {product.title}
        </Link>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-foreground">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium">
              {product.ratingsAverage.toFixed(1)}
            </span>
          </span>
          <span>({numberFormatter.format(product.ratingsQuantity)})</span>
          <span aria-hidden="true">·</span>
          <span>{numberFormatter.format(product.sold)} sold</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="font-heading text-base font-bold">
            {priceFormatter.format(product.price)}
          </span>
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "rounded-full",
            )}
          >
            View
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
           <CardFooter className="p-4">
        <AddToCartBtn productId={product._id} />
      </CardFooter>
      </CardContent>
    </Card>
  );
}

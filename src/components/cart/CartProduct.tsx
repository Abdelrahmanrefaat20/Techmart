import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/response";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

let timeOut: string | number | NodeJS.Timeout;

export default function CartProduct({
  price,
  count,
  product,
  removeProductFromCart,
  updateProductCount,
}: {
  price: number;
  count: number;
  product: Product;
  removeProductFromCart: (productId: string) => Promise<void>;
  updateProductCount: (productId: string, count: number) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);
  const [innerCount, setInnerCount] = useState(count);

  async function handleRemoveProductFromCart() {
    setIsDeleting(true);
    await removeProductFromCart(product._id);
    setIsDeleting(false);
  }

  function handleUpdateProductCount(newCount: number) {
    setInnerCount(newCount);
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      if (newCount > count) {
        setIsIncreasing(true);
      } else {
        setIsDecreasing(true);
      }
      await updateProductCount(product._id, newCount);
      setIsIncreasing(false);
      setIsDecreasing(false);
    }, 500);
  }

  return (
    <li className="flex gap-4 py-5 sm:gap-5 sm:py-6">
      <Link
        href={`/products/${product._id}`}
        className={`relative h-25 w-22 shrink-0 overflow-hidden rounded-xl bg-[#efeeec] sm:size-30 ${focus}`}
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          unoptimized
          sizes="120px"
          className="object-contain p-2 mix-blend-multiply"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${product._id}`}
              className={`line-clamp-2 text-sm font-semibold leading-snug hover:underline sm:text-lg ${focus}`}
            >
              {product.title}
            </Link>
            {product.brand?.name && (
              <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                Brand:{" "}
                <span className="text-neutral-700">{product.brand.name}</span>
              </p>
            )}
            {product.category?.name && (
              <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                Category:{" "}
                <span className="text-neutral-700">
                  {product.category.name}
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label={`Remove ${product.title} from cart`}
            className={`-mr-2 -mt-1 flex size-10 shrink-0 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-40 ${focus}`}
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" size={19} />
            ) : (
              <Trash2
                onClick={handleRemoveProductFromCart}
                size={19}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-base font-semibold tracking-tight sm:text-xl">
              {formatPrice(price * count)}
            </p>
            {count > 1 && (
              <p className="mt-0.5 text-xs text-neutral-500">
                {formatPrice(price)} each
              </p>
            )}
          </div>
          <div
            role="group"
            aria-label={`Quantity for ${product.title}`}
            className="flex items-center rounded-full bg-white px-1"
          >
            <button
              onClick={() => handleUpdateProductCount(innerCount - 1)}
              type="button"
              aria-label={`Decrease quantity of ${product.title}`}
              className={`flex size-10 items-center justify-center rounded-full hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 ${focus}`}
              disabled={isIncreasing || isDecreasing || innerCount == 1}
            >
              {isDecreasing ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Minus size={16} aria-hidden="true" />
              )}
            </button>
            <span
              aria-live="polite"
              className="flex min-w-7 items-center justify-center text-sm tabular-nums"
            >
              {innerCount}
            </span>
            <button
              onClick={() => handleUpdateProductCount(innerCount + 1)}
              type="button"
              aria-label={`Increase quantity of ${product.title}`}
              className={`flex size-10 items-center justify-center rounded-full hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 ${focus}`}
              disabled={isIncreasing || isDecreasing}
            >
              {isIncreasing ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Plus size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
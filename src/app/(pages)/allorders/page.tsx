import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import {
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  Layers,
  LockKeyhole,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { authOptions } from "@/lib/authOptions";
import apiServices from "@/services/apiServices";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { OrderI } from "@/interfaces/order";

export const metadata: Metadata = {
  title: "Your orders · TechMart",
  description:
    "Track every techmart order — status, items and totals in one place.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d2c26]";

const focusOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1f391]";

const numberFormatter = new Intl.NumberFormat("en-US");

const panelClass =
  "flex flex-col items-center justify-center gap-3 rounded-[26px] border border-dashed border-neutral-300 bg-white px-6 py-20 text-center";

const primaryButtonClass = `inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1d2c26] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2b4136] ${focusOnDark}`;

const secondaryButtonClass = `inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium transition-colors hover:border-neutral-400 ${focus}`;

export default function AllOrdersPage() {
  return (
    <main id="main-content" className="flex-1 bg-[#faf9f6] text-[#171717]">
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersContent />
      </Suspense>
    </main>
  );
}

async function OrdersContent() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;


 if (!token) {
  throw new Error("Unauthorized");
}

const verifyToken = await apiServices.verifyToken(token);

const userId = verifyToken.decoded.id;

  console.log(userId)

  const orders = userId
    ? await apiServices.getUserOrders(userId).catch(() => null)
    : null;

  const orderCount = orders?.length ?? 0;
  const totalSpent =
    orders?.reduce((sum, order) => sum + order.totalOrderPrice, 0) ?? 0;
  const deliveredCount =
    orders?.filter((order) => order.isDelivered).length ?? 0;
  const activeCount = orderCount - deliveredCount;

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
            <Package size={14} className="text-[#d1f391]" aria-hidden="true" />
            Order history
          </span>

          <h1 className="mt-6 max-w-2xl text-balance text-3xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Every order,{" "}
            <span className="font-serif font-normal italic text-[#d1f391]">
              tracked.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            From the first click to the doorstep — everything you have ordered,
            and exactly where it is now.
          </p>

          {orderCount > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
              <div>
                <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                  Orders
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {numberFormatter.format(orderCount)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                  Total spent
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {formatPrice(totalSpent)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                  Delivered
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {numberFormatter.format(deliveredCount)}
                </dd>
              </div>
              {activeCount > 0 && (
                <div>
                  <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                    In progress
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums">
                    {numberFormatter.format(activeCount)}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </section>

      {/* Order history */}
      <section
        aria-labelledby="orders-title"
        className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase">
              Your history
            </p>
            <h2
              id="orders-title"
              className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Order history
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              {orderCount > 0
                ? `${numberFormatter.format(orderCount)} ${
                    orderCount === 1 ? "order" : "orders"
                  }, newest first. Open an item to buy it again.`
                : "Your placed orders, delivery status and totals will live here."}
            </p>
          </div>
          <Link
            href="/products"
            className={`group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-black ${focus}`}
          >
            Continue shopping
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {!token ? (
          <div className={panelClass}>
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <LockKeyhole size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">Sign in to see your orders</h3>
            <p className="max-w-sm text-sm text-neutral-500">
              Your order history is tied to your account, so we need you to sign
              in first.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link href="/auth/signin" className={primaryButtonClass}>
                Sign in
              </Link>
              <Link href="/auth/signup" className={secondaryButtonClass}>
                Create an account
              </Link>
            </div>
          </div>
        ) : orders === null ? (
          <div className={panelClass}>
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <Package size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">
              We couldn&apos;t load your orders
            </h3>
            <p className="max-w-sm text-sm text-neutral-500">
              Something went wrong on the way to the warehouse. Please try again.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link href="/allorders" className={primaryButtonClass}>
                Try again
              </Link>
              <Link href="/products" className={secondaryButtonClass}>
                Browse products
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className={panelClass}>
            <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
              <ShoppingBag size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">No orders yet</h3>
            <p className="max-w-sm text-sm text-neutral-500">
              When you place your first order it will show up here, with its
              status and delivery details.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link href="/products" className={primaryButtonClass}>
                <Sparkles size={15} aria-hidden="true" />
                Start shopping
              </Link>
              <Link href="/categories" className={secondaryButtonClass}>
                Browse categories
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-5">
            {orders.map((order) => (
              <li key={order._id}>
                <OrderCard order={order} />
              </li>
            ))}
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
              Looking for something else?
            </p>
            <h2 className="mt-3 max-w-xl text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              The shelf is still open.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/60">
              Reorder a favourite, or find the next upgrade by category.
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
              href="/categories"
              className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 ${focusOnDark}`}
            >
              <Layers size={16} aria-hidden="true" />
              Browse categories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function OrderCard({ order }: { order: OrderI }) {
  const itemCount = order.cartItems.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const subtotal =
    order.totalOrderPrice - order.shippingPrice - order.taxPrice;
  const isCash = order.paymentMethodType === "cash";
  const paymentLabel = isCash ? "Cash on delivery" : "Card payment";

  const steps = [
    { label: "Placed", done: true },
    { label: "Paid", done: order.isPaid },
    { label: "Delivered", done: order.isDelivered },
  ];

  return (
    <article className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-[0_20px_45px_-40px_#1d2c26]">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 px-5 py-5 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">
            Order
          </p>
          <h3 className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold tracking-tight">
            #{order.id}
            <OrderStatus order={order} />
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Placed {formatDate(order.createdAt)}
            {itemCount > 0 &&
              ` · ${numberFormatter.format(itemCount)} ${
                itemCount === 1 ? "item" : "items"
              }`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">
            Total
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight">
            {formatPrice(order.totalOrderPrice)}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">{paymentLabel}</p>
        </div>
      </header>

      <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1.5fr_0.9fr] lg:gap-8">
        <ul className="divide-y divide-neutral-100">
          {order.cartItems.length === 0 ? (
            <li className="flex items-center gap-3 rounded-2xl bg-[#faf9f6] px-4 py-3 text-sm text-neutral-500">
              <Package size={16} aria-hidden="true" className="shrink-0" />
              Item details are no longer available for this order.
            </li>
          ) : (
            order.cartItems.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <Link
                  href={`/products/${item.product.id}`}
                  aria-label={item.product.title}
                  className={`relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ${focus}`}
                >
                  <Image
                    src={item.product.imageCover}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className={`line-clamp-2 text-sm font-medium transition-colors hover:text-[#63893d] ${focus}`}
                  >
                    {item.product.title}
                  </Link>
                  <p className="mt-1 text-xs text-neutral-500">
                    {item.product.brand?.name} · Qty {item.count}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatPrice(item.price * item.count)}
                </span>
              </li>
            ))
          )}
        </ul>

        <div className="rounded-2xl border border-neutral-100 bg-[#faf9f6] p-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Shipping</dt>
              <dd className="tabular-nums">
                {order.shippingPrice === 0
                  ? "Free"
                  : formatPrice(order.shippingPrice)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Tax</dt>
              <dd className="tabular-nums">{formatPrice(order.taxPrice)}</dd>
            </div>
            <div className="mt-2 flex justify-between gap-3 border-t border-neutral-200 pt-2 font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">
                {formatPrice(order.totalOrderPrice)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 space-y-2.5 border-t border-neutral-200 pt-3 text-xs text-neutral-500">
            <p className="flex items-start gap-2">
              <MapPin
                size={14}
                aria-hidden="true"
                className="mt-px shrink-0 text-[#63893d]"
              />
              <span>
                {order.shippingAddress.city}
                {order.shippingAddress.details
                  ? ` — ${order.shippingAddress.details}`
                  : ""}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone
                size={14}
                aria-hidden="true"
                className="shrink-0 text-[#63893d]"
              />
              {order.shippingAddress.phone}
            </p>
            <p className="flex items-center gap-2">
              {isCash ? (
                <Banknote
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 text-[#63893d]"
                />
              ) : (
                <CreditCard
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 text-[#63893d]"
                />
              )}
              {paymentLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-2",
                index < steps.length - 1 && "flex-1",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  step.done
                    ? "bg-[#1d2c26] text-[#d1f391]"
                    : "bg-neutral-100 text-neutral-400",
                )}
              >
                {step.done ? (
                  <Check size={12} aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  step.done ? "text-neutral-900" : "text-neutral-400",
                )}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px flex-1",
                    step.done ? "bg-[#1d2c26]/25" : "bg-neutral-200",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function OrderStatus({ order }: { order: OrderI }) {
  if (order.isDelivered) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf1e0] px-2.5 py-1 text-[11px] font-semibold text-[#4d6b2f]">
        <Check size={11} aria-hidden="true" />
        Delivered
      </span>
    );
  }

  if (order.isPaid) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d2c26] px-2.5 py-1 text-[11px] font-semibold text-[#d1f391]">
        <Truck size={11} aria-hidden="true" />
        On the way
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
      <Package size={11} aria-hidden="true" />
      Processing
    </span>
  );
}

function OrdersSkeleton() {
  return (
    <>
      <div className="bg-[#1d2c26]">
        <div className="container px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="h-8 w-36 animate-pulse rounded-full bg-white/10" />
          <div className="mt-6 h-12 w-2/5 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
          <div className="mt-8 h-16 w-full max-w-md animate-pulse rounded-2xl bg-white/10" />
        </div>
      </div>

      <div className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-6 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-7 w-48 animate-pulse rounded-full bg-neutral-200" />
        </div>
        <div className="space-y-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[26px] border border-neutral-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded-full bg-neutral-200" />
                  <div className="h-5 w-28 animate-pulse rounded-full bg-neutral-200" />
                  <div className="h-3 w-40 animate-pulse rounded-full bg-neutral-200" />
                </div>
                <div className="h-6 w-24 animate-pulse rounded-full bg-neutral-200" />
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="size-16 animate-pulse rounded-xl bg-neutral-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded-full bg-neutral-200" />
                        <div className="h-3 w-1/3 animate-pulse rounded-full bg-neutral-200" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-40 animate-pulse rounded-2xl bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

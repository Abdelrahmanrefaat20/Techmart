import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import type { LucideIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Heart,
  LockKeyhole,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { authOptions } from "@/lib/authOptions";
import apiServices from "@/services/apiServices";
import { formatDate, formatPrice } from "@/lib/utils";
import ChangePasswordForm from "@/components/layout/Profile/ChangePasswordForm";
import SignOutButton from "@/components/layout/Profile/SignOutButton";

export const metadata: Metadata = {
  title: "Your profile · TechMart",
  description: "Your TechMart account details, saved picks and orders.",
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

const eyebrowClass =
  "text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase";

const cardClass = "rounded-[26px] border border-neutral-200 bg-white p-5 sm:p-6";

export default function ProfilePage() {
  return (
    <main id="main-content" className="flex-1 bg-[#faf9f6] text-[#171717]">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}

async function ProfileContent() {
  await connection();

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (!token) {
    return <SignedOutProfile />;
  }

  const verified = await apiServices.verifyToken(token).catch(() => null);
  const decoded = verified?.decoded;

  const name = decoded?.name || session.user.name || "TechMart member";
  const email = session.user.email ?? "";
  const role = decoded?.role || session.user.role || "user";
  const apiUserId = decoded?.id || session.user.id;
  const memberSince = decoded?.iat ? new Date(decoded.iat * 1000) : null;
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const roleLabel = role === "admin" ? "Administrator" : "Member";

  const [wishlist, orders] = await Promise.all([
    apiServices.getUserWishlist(token).catch(() => null),
    apiUserId
      ? apiServices.getUserOrders(apiUserId).catch(() => null)
      : Promise.resolve(null),
  ]);

  const savedCount = wishlist ? wishlist.data.length : null;
  const ordersCount = orders ? orders.length : null;
  const totalSpent = orders
    ? orders.reduce((sum, order) => sum + order.totalOrderPrice, 0)
    : null;

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
            <UserRound size={14} className="text-[#d1f391]" aria-hidden="true" />
            Your account
          </span>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#d1f391] text-2xl font-semibold tracking-tight text-[#1d2c26] ring-4 ring-white/10">
              {initials(name)}
            </span>

            <div className="min-w-0">
              <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Hello,{" "}
                <span className="font-serif font-normal italic text-[#d1f391]">
                  {firstName}.
                </span>
              </h1>

              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={14} aria-hidden="true" />
                  {email || "No email on file"}
                </span>

                {memberSince && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} aria-hidden="true" />
                    Member since {formatDate(memberSince)}
                  </span>
                )}

                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80">
                  {roleLabel}
                </span>
              </p>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-10 gap-y-4 border-t border-white/10 pt-6 sm:grid-cols-3 sm:gap-x-16">
            <Stat
              label="Orders"
              value={
                ordersCount === null
                  ? "—"
                  : numberFormatter.format(ordersCount)
              }
            />
            <Stat
              label="Saved items"
              value={
                savedCount === null ? "—" : numberFormatter.format(savedCount)
              }
            />
            <Stat
              label="Total spent"
              value={totalSpent === null ? "—" : formatPrice(totalSpent)}
            />
          </dl>
        </div>
      </section>

      {/* Details */}
      <section className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
          <div className="space-y-6">
            {/* Account details */}
            <article className={cardClass}>
              <header className="flex items-start justify-between gap-4">
                <div>
                  <p className={eyebrowClass}>Personal</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    Account details
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    The basics we use to reach you.
                  </p>
                </div>

                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eaf1e0] text-[#4d6b2f]">
                  <BadgeCheck size={18} aria-hidden="true" />
                </span>
              </header>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <Detail icon={UserRound} label="Full name" value={name} />
                <Detail
                  icon={Mail}
                  label="Email address"
                  value={email || "Not provided"}
                />
                <Detail
                  icon={ShieldCheck}
                  label="Account type"
                  value={roleLabel}
                />
                <Detail
                  icon={CalendarDays}
                  label="Member since"
                  value={memberSince ? formatDate(memberSince) : "—"}
                />
              </dl>

              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-[#faf9f6] px-4 py-3 text-xs leading-5 text-neutral-500">
                <LockKeyhole
                  size={14}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#63893d]"
                />
                These details are tied to your account. Need a change? Reach out
                to our support team and we&apos;ll help you out.
              </p>
            </article>

            {/* Change password */}
            <article className={cardClass}>
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className={eyebrowClass}>Security</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    Change password
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Keep your account safe with a fresh password.
                  </p>
                </div>

              </header>

              <ChangePasswordForm />
            </article>
          </div>

          <aside className="space-y-6">
            {/* Quick links */}
            <article className={cardClass}>
              <h2 className="text-lg font-semibold tracking-tight">
                Quick links
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Jump back to the good stuff.
              </p>

              <nav aria-label="Account shortcuts" className="mt-4 space-y-1">
                <QuickLink
                  href="/allorders"
                  icon={Package}
                  label="Your orders"
                  hint={
                    ordersCount === null
                      ? "View your order history"
                      : `${numberFormatter.format(ordersCount)} ${
                          ordersCount === 1 ? "order" : "orders"
                        } placed`
                  }
                />
                <QuickLink
                  href="/wishlist"
                  icon={Heart}
                  label="Wishlist"
                  hint={
                    savedCount === null
                      ? "Your saved picks"
                      : `${numberFormatter.format(savedCount)} ${
                          savedCount === 1 ? "item" : "items"
                        } saved`
                  }
                />
                <QuickLink
                  href="/cart"
                  icon={ShoppingCart}
                  label="Your cart"
                  hint="Ready to check out"
                />
                <QuickLink
                  href="/products"
                  icon={ShoppingBag}
                  label="Continue shopping"
                  hint="Browse the collection"
                />
              </nav>
            </article>

            {/* Sign out */}
            <article className="relative overflow-hidden rounded-[26px] bg-[#1d2c26] p-5 text-white sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-[#d1f391]/20 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-[#63893d]/30 blur-3xl"
              />

              <p className="relative text-[11px] font-semibold tracking-[0.18em] text-[#d1f391] uppercase">
                All done?
              </p>
              <h2 className="relative mt-2 text-xl font-semibold tracking-tight">
                Sign out of this device.
              </h2>
              <p className="relative mt-1 text-sm text-white/60">
                You can sign back in any time — your saved picks will be waiting.
              </p>

              <div className="relative">
                <SignOutButton />
              </div>
            </article>
          </aside>
        </div>
      </section>
    </>
  );
}

function SignedOutProfile() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#1d2c26] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[#d1f391]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-[#63893d]/30 blur-3xl"
        />

        <div className="container relative px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
            <UserRound size={14} className="text-[#d1f391]" aria-hidden="true" />
            Your account
          </span>

          <h1 className="mt-6 max-w-2xl text-balance text-3xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Your account,{" "}
            <span className="font-serif font-normal italic text-[#d1f391]">
              in one place.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            Sign in to see your details, saved picks and order history — all in
            one quiet corner.
          </p>
        </div>
      </section>

      <section className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className={panelClass}>
          <span className="flex size-14 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-500">
            <LockKeyhole size={26} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold">
            Sign in to view your profile
          </h2>
          <p className="max-w-sm text-sm text-neutral-500">
            Your profile is tied to your account, so we need you to sign in
            first.
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
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#faf9f6] px-4 py-3">
      <dt className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] text-neutral-400 uppercase">
        <Icon size={12} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-medium text-neutral-900">
        {value}
      </dd>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  hint,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-colors hover:border-neutral-200 hover:bg-[#faf9f6] ${focus}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eaf1e0] text-[#4d6b2f]">
        <Icon size={16} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block truncate text-xs text-neutral-500">{hint}</span>
      </span>

      <ArrowRight
        size={15}
        aria-hidden="true"
        className="shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return letters || "T";
}

function ProfileSkeleton() {
  return (
    <>
      <div className="bg-[#1d2c26]">
        <div className="container px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="mt-6 flex items-center gap-5">
            <div className="size-20 animate-pulse rounded-full bg-white/10" />
            <div className="space-y-3">
              <div className="h-9 w-56 animate-pulse rounded-2xl bg-white/10" />
              <div className="h-4 w-72 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
          <div className="mt-8 h-20 w-full max-w-lg animate-pulse rounded-2xl bg-white/10" />
        </div>
      </div>

      <div className="container px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
          <div className="space-y-6">
            <div className="rounded-[26px] border border-neutral-200 bg-white p-6">
              <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-3 h-6 w-40 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-2xl bg-neutral-100"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-neutral-200 bg-white p-6">
              <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-3 h-6 w-44 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-5 space-y-3">
                <div className="h-11 animate-pulse rounded-2xl bg-neutral-100" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-11 animate-pulse rounded-2xl bg-neutral-100" />
                  <div className="h-11 animate-pulse rounded-2xl bg-neutral-100" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[26px] border border-neutral-200 bg-white p-6">
              <div className="h-6 w-28 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-14 animate-pulse rounded-2xl bg-neutral-100"
                  />
                ))}
              </div>
            </div>

            <div className="h-52 animate-pulse rounded-[26px] bg-[#1d2c26]/90" />
          </div>
        </div>
      </div>
    </>
  );
}

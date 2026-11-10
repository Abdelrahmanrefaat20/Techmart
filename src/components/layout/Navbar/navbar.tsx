"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { RootState } from "@/redux/store";
import { cn } from "cn";
import {
  Heart,
  ShoppingCart,
  UserRound,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const navLinks = [
  { title: "Products", href: "/products" },
  { title: "Categories", href: "/categories" },
  { title: "Brands", href: "/brands" },
  { title: "Orders", href: "/allorders" },
];

export default function Navbar() {
  const pathName = usePathname();
  const session = useSession();
  const { NumberOfWishlistItem } = useWishlist();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const numberOfCartItems = useSelector(
    (state: RootState) => state.cart.numberOfCartItems
  );

  const visibleNavLinks = navLinks.filter(
    (link) =>
      !(
        session.status === "unauthenticated" &&
        link.href === "/allorders"
      )
  );

  const isActive = (href: string) =>
    pathName === href || pathName.startsWith(`${href}/`);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="sticky top-0 z-[1000] bg-white">
      <div className="bg-[#1d2c26] px-4 py-2.5 text-center text-xs tracking-wide text-white">
        Good tech. Great possibilities.
        <span className="ml-2 text-[#ceec9b]">
          Find your next everyday upgrade.
        </span>
      </div>

      <div className="container mx-auto">
        <header className="flex w-full items-center justify-between px-5 py-5 sm:px-8 lg:px-12">

          {/* Logo */}
          <Link
            href="/"
            aria-label="TechMart home"
            onClick={closeMenu}
            className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.08em]"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#1d2c26] text-[#d1f391]">
              <Zap size={19} fill="currentColor" />
            </span>
            techmart<span className="text-[#63893d]">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-sm font-medium md:flex"
          >
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-[#64843f]",
                  isActive(link.href) && "font-bold text-[#64843f]"
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">

            {session.status === "authenticated" && (
              <Link
                href="/profile"
                aria-label="Your profile"
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border border-[#d9dfd3] text-[#1d2c26] transition-colors hover:bg-[#eaf1e0]",
                  pathName.startsWith("/profile") && "bg-[#eaf1e0]"
                )}
              >
                <UserRound className="h-4 w-4" />
              </Link>
            )}

            {session.status === "authenticated" && (
              <>
                <Link
                  href="/cart"
                  aria-label="Shopping cart"
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute bottom-1 inset-e-1 translate-x-1/2 -translate-y-1/2">
                    <Badge variant="destructive">
                      {numberOfCartItems}
                    </Badge>
                  </span>
                </Link>

                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="relative"
                >
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="absolute bottom-1 inset-e-1 translate-x-1/2 -translate-y-1/2">
                    <Badge variant="destructive">
                      {NumberOfWishlistItem}
                    </Badge>
                  </span>
                </Link>
              </>
            )}

            {/* Desktop Authentication */}
            {session.status === "unauthenticated" && (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/api/auth/signin"
                  className="rounded-full border border-[#d9dfd3] px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#eaf1e0]"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  className="rounded-full border border-[#d9dfd3] px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#eaf1e0]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {session.status === "authenticated" && (
              <Button
                onClick={() =>
                  signOut({ callbackUrl: "/auth/signin" })
                }
                className="hidden rounded-full border border-[#d9dfd3] bg-white px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-[#eaf1e0] md:flex"
              >
                Sign Out
              </Button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="flex size-9 items-center justify-center rounded-lg border border-[#d9dfd3] transition-colors hover:bg-[#eaf1e0] md:hidden"
            >
              {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="border-t border-[#e5e7df] px-5 py-5 md:hidden">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-4"
            >
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#64843f]",
                    isActive(link.href)
                      ? "font-bold text-[#64843f]"
                      : "text-[#1d2c26]"
                  )}
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            <div className="mt-5 border-t border-[#e5e7df] pt-5">
              {session.status === "unauthenticated" && (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/api/auth/signin"
                    onClick={closeMenu}
                    className="rounded-full border border-[#d9dfd3] px-4 py-3 text-center text-sm font-semibold hover:bg-[#eaf1e0]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/auth/signup"
                    onClick={closeMenu}
                    className="rounded-full bg-[#1d2c26] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#31483d]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {session.status === "authenticated" && (
                <Button
                  onClick={() =>
                    signOut({ callbackUrl: "/auth/signin" })
                  }
                  className="w-full rounded-full border border-[#d9dfd3] bg-white py-3 text-sm font-semibold text-black hover:bg-[#eaf1e0]"
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
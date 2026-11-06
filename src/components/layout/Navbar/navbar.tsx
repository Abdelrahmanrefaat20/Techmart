"use client";
import { Badge } from "@/components/ui/badge";
import { counterContext } from "@/contexts/counterContext";
import { cn } from "cn";
import { ArrowRight, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const navLinks = [
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Categories",
    href: "/categories",
  },
  {
    title: "Brands",
    href: "/brands",
  },
];

export default function Navbar() {
  const pathName = usePathname();
         const {  NumberOfCartItem } = useContext(counterContext)

  return (
  <div className="sticky top-0 z-1000 bg-white">      <div className="bg-[#1d2c26] px-4 py-2.5 text-center text-xs tracking-wide text-white">
        Good tech. Great possibilities.{" "}
        <span className="ml-2 text-[#ceec9b]">
          Find your next everyday upgrade.
        </span>
      </div>
      <div className="container mx-auto  ">
        <header className="mx-auto w-full flex flex-wrap items-center justify-between gap-5 px-5 py-6 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="TechMart home"
            className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.08em]"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#1d2c26] text-[#d1f391]">
              <Zap size={19} fill="currentColor" />
            </span>
            techmart<span className="text-[#63893d]">.</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="order-3 flex w-full justify-center gap-7 border-t border-[#e5e7df] pt-4 text-sm font-medium sm:order-none sm:w-auto sm:border-0 sm:pt-0"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-[#64843f]",
                  pathName.includes(link.href)
                    ? "text-[#64843f] font-bold"
                    : "",
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>
    <div className="flex gap-3 items-center">



            <Link href={"/cart"}>
            <div className="relative">
              <span className="absolute bottom-1 inset-e-1 translate-x-1/2 -translate-y-1/2">
                  <Badge variant="destructive">{NumberOfCartItem}</Badge>
              </span>
              
              <ShoppingCart className="mr-2 h-5 w-5" />
            </div>
            </Link>
            <Link
              href="/api/auth/signin"
              className="flex items-center gap-2 rounded-full border border-[#d9dfd3] px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#eaf1e0]"
            >
              Sign In
            </Link>
            <a
              href="#collection"
              className="flex items-center gap-2 rounded-full border border-[#d9dfd3] px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#eaf1e0]"
            >
              Sign Up
            </a>
            <a
              href="#collection"
              className="flex items-center gap-2 rounded-full border border-[#d9dfd3] px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#eaf1e0]"
            >
              Sign Out
            </a>
          </div>
        </header>
      </div>
    </div>
  );
}
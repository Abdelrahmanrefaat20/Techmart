import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e2e5dc]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-7 text-xs sm:flex-row sm:px-8 lg:px-12">
        <Link href="/" className="text-lg font-extrabold tracking-[-0.07em]">
          techmart<span className="text-[#63893d]">.</span>
        </Link>
        <p className="text-[#74796f]">A little upgrade for your everyday.</p>
        <Link
          href="#main-content"
          className="flex items-center gap-2 font-medium hover:text-[#63893d]"
        >
          Back to top <ArrowRight size={14} className="-rotate-90" />
        </Link>
      </div>
    </footer>
  );
}
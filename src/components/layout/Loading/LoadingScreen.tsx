import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  /** Text shown under the progress bar, also used as the live-region label. */
  label?: string;
  /** `page` fills the content area (used by `loading.tsx`), `overlay` fills the viewport. */
  variant?: "page" | "overlay";
  className?: string;
};

const highlights = ["Curated tech", "Top brands", "Everyday value"];

export default function LoadingScreen({
  label = "Loading your next upgrade",
  variant = "page",
  className,
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "relative isolate flex w-full flex-col items-center justify-center overflow-hidden bg-[#1d2c26] text-white",
        variant === "overlay" ? "h-dvh" : "min-h-[70svh] flex-1",
        className,
      )}
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-[#d1f391]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/4 size-96 rounded-full bg-[#63893d]/30 blur-3xl"
      />

      {/* Indeterminate progress line pinned to the top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-white/10"
      >
        <span className="eb-loader-bar absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#d1f391] to-transparent" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 py-16 text-center">
        <div className="relative flex size-16 items-center justify-center">
          <span
            aria-hidden="true"
            className="eb-loader-ring absolute inset-0 rounded-2xl bg-[#d1f391]/35"
          />
          <span className="relative flex size-16 items-center justify-center rounded-2xl bg-[#d1f391] text-[#1d2c26] shadow-[0_0_0_1px_rgba(209,243,145,0.35),0_18px_45px_-18px_rgba(209,243,145,0.9)]">
            <Zap size={30} fill="currentColor" strokeWidth={1.5} />
          </span>
        </div>

        <p className="mt-7 text-2xl font-extrabold tracking-[-0.08em]">
          techmart<span className="text-[#9dc96a]">.</span>
        </p>
        <p className="mt-2 text-[10px] font-semibold tracking-[0.3em] text-[#d1f391]/65 uppercase">
          Good tech. Great possibilities.
        </p>

        <div className="mt-10 w-64">
          <div
            aria-hidden="true"
            className="h-1.5 overflow-hidden rounded-full bg-white/10"
          >
            <span className="eb-loader-bar block h-full w-2/5 rounded-full bg-gradient-to-r from-[#63893d] via-[#d1f391] to-[#63893d]" />
          </div>

          <div
            aria-hidden="true"
            className="mt-5 flex items-center justify-center gap-1.5"
          >
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="eb-loader-dot size-1.5 rounded-full bg-[#d1f391]"
                style={{ animationDelay: `${index * 160}ms` }}
              />
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm font-medium text-white/85">{label}</p>
        <p className="mt-1.5 text-xs text-white/45">
          Please hold on while we bring the page to you.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium">
          {highlights.map((highlight, index) => (
            <span
              key={highlight}
              className="eb-loader-tag rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-white/70"
              style={{ animationDelay: `${index * 220}ms` }}
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

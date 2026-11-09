"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  KeyRound,
  LoaderCircle,
  MailCheck,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { toast } from "@/components/ui/toast";
import apiServices from "@/services/apiServices";

const resetCodeSchema = z.object({
  resetCode: z
    .string()
    .trim()
    .length(6, "Verification code must contain 6 digits.")
    .regex(/^\d{6}$/, "Enter a valid 6-digit code."),
});

type ResetCodeValues = z.infer<typeof resetCodeSchema>;

const inputClass =
  "h-16 w-full rounded-xl border border-[#dfe4da] bg-[#fafbf8] px-4 text-center text-2xl font-semibold tracking-[0.45em] text-[#20332a] tabular-nums outline-none transition placeholder:tracking-[0.45em] placeholder:text-[#c3c9bb] hover:border-[#b7c4ac] focus:border-[#67834e] focus:bg-white focus:ring-4 focus:ring-[#dce9ca]/60 aria-invalid:border-red-400 aria-invalid:focus:ring-red-100 disabled:opacity-60";

export default function VerifyResetCode() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetCodeValues>({
    resolver: zodResolver(resetCodeSchema),
    mode: "onTouched",
    defaultValues: {
      resetCode: "",
    },
  });

async function onSubmit(data: ResetCodeValues) {

  try {
    const response = await apiServices.verifyResetCode(data.resetCode);

    console.log("Verify response:", response);
    console.log("Status:", response.status);

    if (response.status?.toLowerCase() === "success") {
      toast.add({
        title: "Code verified",
        description: "Now choose a fresh password.",
        type: "success",
      });

      router.push("/forgot-password/verify-reset-code/reset-password");
      return;
    }

    setError("root", {
      message:
        response.status || "That code didn't work. Please try again.",
    });
  } catch (error) {
    console.error("Verification error:", error);

    setError("root", {
      message: "Something went wrong. Please try again in a moment.",
    });
  }
}

  return (
    <main className="bg-[#fafaf8] px-4 py-8 text-[#20332a] sm:px-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/forgot-password"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#697461] transition hover:text-[#20332a] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <ArrowLeft size={15} /> Use a different email
        </Link>

        <div className="grid overflow-hidden rounded-[28px] border border-[#e3e7dd] bg-white shadow-[0_20px_80px_-30px_#20332a25] lg:grid-cols-[1fr_1fr]">
          <section
            aria-labelledby="verify-welcome-title"
            className="relative isolate flex flex-col overflow-hidden bg-[#e8efdc] p-7 sm:p-10 lg:p-12"
          >
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-[#526747]">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#d4e4bb]">
                <Zap size={12} fill="currentColor" />
              </span>
              YOUR EVERYDAY, UPGRADED
            </div>

            <h1
              id="verify-welcome-title"
              className="mt-7 text-4xl leading-[1.1] font-semibold tracking-[-0.055em] sm:text-5xl"
            >
              One code.
              <br />
              Back to{" "}
              <span className="font-serif font-normal italic text-[#657e50]">
                your picks.
              </span>
            </h1>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#64705b]">
              We sent a 6-digit code to your inbox. Pop it in and we&apos;ll get
              you straight to a new password.
            </p>

            <div
              aria-hidden="true"
              className="relative my-7 hidden h-56 items-center justify-center sm:flex lg:my-9 lg:h-60"
            >
              <div className="absolute size-60 rounded-full border border-[#c9d7b7]" />
              <div className="absolute size-46 rounded-full border border-[#c9d7b7]" />
              <div className="absolute size-32 rounded-full bg-[#d6e4c2]" />

              <div className="relative -rotate-2 rounded-[38px] border border-white/30 bg-[#243b2e] p-7 shadow-[10px_22px_35px_-12px_#243b2e70]">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#d1edaa] text-[#2c4536]">
                    <MailCheck size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <div className="h-2 w-20 rounded-full bg-[#d1edaa]/80" />
                    <div className="mt-2 h-2 w-12 rounded-full bg-[#d1edaa]/40" />
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  {["4", "8", "1", "9", "2", "6"].map((digit) => (
                    <span
                      key={digit}
                      className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-[11px] font-semibold text-[#d1edaa]"
                    >
                      {digit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute top-1 right-2 rotate-6 rounded-2xl border border-white/70 bg-white/70 p-3 text-[#627d4c] shadow-sm backdrop-blur-sm sm:right-6">
                <KeyRound size={24} strokeWidth={1.5} />
              </div>

              <div className="absolute bottom-0 left-0 -rotate-3 rounded-xl border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <Sparkles size={14} className="text-[#6f8c50]" /> Six digits.
                  Seconds to go.
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-[#cbd7bd] pt-5 sm:mt-auto">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dbe7cb] text-[#567044]">
                <ShieldCheck size={20} strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-xs font-semibold">
                  Check the inbox you know.
                </p>
                <p className="mt-1 text-[11px] text-[#64705b]">
                  If nothing shows up, look in spam or resend from the previous
                  step.
                </p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="verify-title"
            className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-14"
          >
            <div className="mb-7 flex size-12 items-center justify-center rounded-2xl border border-[#e4e9dc] bg-[#f3f6ed] text-[#5a7546]">
              <MailCheck size={22} strokeWidth={1.5} />
            </div>

            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#718361]">
              ALMOST THERE
            </p>
            <h2
              id="verify-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
            >
              Enter your reset code
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#7a8274]">
              Type the 6-digit code from your email. It expires 15 minutes after
              it was sent.
            </p>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
              aria-busy={isSubmitting}
            >
              <div>
                <label
                  htmlFor="resetCode"
                  className="mb-2 block text-xs font-semibold"
                >
                  Reset code
                </label>
                <input
                  {...register("resetCode")}
                  id="resetCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.resetCode}
                  aria-describedby={
                    errors.resetCode ? "resetCode-error" : undefined
                  }
                  className={inputClass}
                />
                {errors.resetCode && (
                  <p
                    id="resetCode-error"
                    role="alert"
                    className="mt-2 text-xs text-red-600"
                  >
                    {errors.resetCode.message}
                  </p>
                )}
              </div>

              {errors.root && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-700"
                >
                  <CircleAlert size={16} className="mt-0.5 shrink-0" />
                  {errors.root.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#243b2e] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#36533c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#67834e] disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="motion-safe:animate-spin"
                    />{" "}
                    Checking your code…
                  </>
                ) : (
                  <>
                    Verify code{" "}
                    <ArrowRight
                      size={17}
                      className="transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-6 text-[#7a8274]">
              Didn&apos;t get it?{" "}
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1 font-semibold text-[#4f693d] underline-offset-4 hover:underline"
              >
                Send a new code <ArrowRight size={12} />
              </Link>
            </p>

            <div className="mt-7 flex items-center gap-3 text-[10px] text-[#909887]">
              <span className="h-px flex-1 bg-[#e7eadf]" /> A LITTLE MORE
              POSSIBILITY <span className="h-px flex-1 bg-[#e7eadf]" />
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-[#7a8274]">
              Remembered it after all?{" "}
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1 font-semibold text-[#4f693d] underline-offset-4 hover:underline"
              >
                Sign in <ArrowRight size={12} />
              </Link>
            </p>

            <p className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-[#858e7b]">
              <ShieldCheck size={13} /> Your code is private. Never share it.
            </p>
          </section>
        </div>

        <p className="mt-6 text-center text-[11px] tracking-wide text-[#8c9484]">
          Good tech. Thoughtfully chosen. Always TechMart.
        </p>
      </div>
    </main>
  );
}

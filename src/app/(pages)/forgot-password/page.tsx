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
  Mail,
  MailCheck,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { toast } from "@/components/ui/toast";
import apiServices from "@/services/apiServices";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
});

type EmailValues = z.infer<typeof emailSchema>;

const inputClass =
  "h-14 w-full rounded-xl border border-[#dfe4da] bg-[#fafbf8] pr-4 pl-12 text-sm text-[#20332a] outline-none transition placeholder:text-[#92998d] hover:border-[#b7c4ac] focus:border-[#67834e] focus:bg-white focus:ring-4 focus:ring-[#dce9ca]/60 aria-invalid:border-red-400 aria-invalid:focus:ring-red-100 disabled:opacity-60";

const iconClass =
  "pointer-events-none absolute top-[19px] left-4 text-[#8a957e]";

export default function ForgotPassword() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    mode: "onTouched",
   
  });

  async function onSubmit(data: EmailValues) {
    try {
      const response = await apiServices.forgetPassword(data.email);

      if (response.statusMsg === "success") {
        // The last step needs the email again, so keep it for this session only.
        window.sessionStorage.setItem("techmart:reset-email", data.email);
        toast.add({
          title: "Check your inbox",
          description: "Reset code sent to your email.",
          type: "success",
        });
        router.push("/forgot-password/verify-reset-code");
        return;
      }

      setError("root", {
        message:
          response.message && response.message !== "fail"
            ? response.message
            : "We couldn't send a reset code. Please try again.",
      });
    } catch {
      setError("root", {
        message: "Something went wrong. Please try again in a moment.",
      });
    }
  }

  return (
    <main className="bg-[#fafaf8] px-4 py-8 text-[#20332a] sm:px-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#697461] transition hover:text-[#20332a] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <ArrowLeft size={15} /> Back to the good stuff
        </Link>

        <div className="grid overflow-hidden rounded-[28px] border border-[#e3e7dd] bg-white shadow-[0_20px_80px_-30px_#20332a25] lg:grid-cols-[1fr_1fr]">
          <section
            aria-labelledby="forgot-welcome-title"
            className="relative isolate flex flex-col overflow-hidden bg-[#e8efdc] p-7 sm:p-10 lg:p-12"
          >
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-[#526747]">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#d4e4bb]">
                <Zap size={12} fill="currentColor" />
              </span>
              YOUR EVERYDAY, UPGRADED
            </div>

            <h1
              id="forgot-welcome-title"
              className="mt-7 text-4xl leading-[1.1] font-semibold tracking-[-0.055em] sm:text-5xl"
            >
              Forgot it?
              <br />
              It{" "}
              <span className="font-serif font-normal italic text-[#657e50]">
                happens.
              </span>
            </h1>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#64705b]">
              No stress. Drop in the email you signed up with and we&apos;ll send
              a short reset code to get you back in.
            </p>

            <div
              aria-hidden="true"
              className="relative my-7 hidden h-56 items-center justify-center sm:flex lg:my-9 lg:h-60"
            >
              <div className="absolute size-60 rounded-full border border-[#c9d7b7]" />
              <div className="absolute size-46 rounded-full border border-[#c9d7b7]" />
              <div className="absolute size-32 rounded-full bg-[#d6e4c2]" />

              <div className="relative rotate-3 rounded-[38px] border border-white/30 bg-[#243b2e] p-7 shadow-[10px_22px_35px_-12px_#243b2e70]">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#d1edaa] text-[#2c4536]">
                    <Mail size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <div className="h-2 w-20 rounded-full bg-[#d1edaa]/80" />
                    <div className="mt-2 h-2 w-12 rounded-full bg-[#d1edaa]/40" />
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <div className="h-2 w-32 rounded-full bg-white/15" />
                  <div className="h-2 w-24 rounded-full bg-white/15" />
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-[11px] font-medium text-[#d1edaa]">
                  <MailCheck size={15} strokeWidth={1.7} />
                  Reset code on its way
                </div>
              </div>

              <div className="absolute top-1 right-2 -rotate-6 rounded-2xl border border-white/70 bg-white/70 p-3 text-[#627d4c] shadow-sm backdrop-blur-sm sm:right-6">
                <KeyRound size={24} strokeWidth={1.5} />
              </div>

              <div className="absolute bottom-0 left-0 rotate-3 rounded-xl border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <Sparkles size={14} className="text-[#6f8c50]" /> One email.
                  Back to your favorites.
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-[#cbd7bd] pt-5 sm:mt-auto">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dbe7cb] text-[#567044]">
                <ShieldCheck size={20} strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-xs font-semibold">Short-lived, single-use.</p>
                <p className="mt-1 text-[11px] text-[#64705b]">
                  Reset codes expire after 15 minutes for your safety.
                </p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="forgot-title"
            className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-14"
          >
            <div className="mb-7 flex size-12 items-center justify-center rounded-2xl border border-[#e4e9dc] bg-[#f3f6ed] text-[#5a7546]">
              <KeyRound size={22} strokeWidth={1.5} />
            </div>

            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#718361]">
              LET&apos;S GET YOU BACK IN
            </p>
            <h2
              id="forgot-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
            >
              Reset your password
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#7a8274]">
              Enter the email tied to your account and we&apos;ll send you a
              6-digit reset code.
            </p>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
              aria-busy={isSubmitting}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.5}
                    className={iconClass}
                  />
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClass}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-2 text-xs text-red-600"
                  >
                    {errors.email.message}
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
                    Sending reset code…
                  </>
                ) : (
                  <>
                    Send reset code{" "}
                    <ArrowRight
                      size={17}
                      className="transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-6 text-[#7a8274]">
              Remembered your password?{" "}
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1 font-semibold text-[#4f693d] underline-offset-4 hover:underline"
              >
                Sign in <ArrowRight size={12} />
              </Link>
            </p>

            <div className="mt-7 flex items-center gap-3 text-[10px] text-[#909887]">
              <span className="h-px flex-1 bg-[#e7eadf]" /> A LITTLE MORE
              POSSIBILITY <span className="h-px flex-1 bg-[#e7eadf]" />
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-[#7a8274]">
              New around here?{" "}
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1 font-semibold text-[#4f693d] underline-offset-4 hover:underline"
              >
                Create an account <ArrowRight size={12} />
              </Link>
            </p>

            <p className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-[#858e7b]">
              <ShieldCheck size={13} /> We&apos;ll only use this email to help
              you reset.
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

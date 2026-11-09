"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  CircleAlert,
  Eye,
  EyeOff,
  Headphones,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: SignInValues) {
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (response?.ok) {
      router.push("/products");
    } else {
      setError("root", {
        message: "Invalid email or password",
      });
    }
  }

  const inputClass =
    "h-14 w-full rounded-xl border border-[#dfe4da] bg-[#fafbf8] pr-12 pl-12 text-sm text-[#20332a] outline-none transition placeholder:text-[#92998d] hover:border-[#b7c4ac] focus:border-[#67834e] focus:bg-white focus:ring-4 focus:ring-[#dce9ca]/60 aria-invalid:border-red-400 aria-invalid:focus:ring-red-100 disabled:opacity-60";

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
            aria-labelledby="welcome-title"
            className="relative isolate flex flex-col overflow-hidden bg-[#e8efdc] p-7 sm:p-10 lg:p-12"
          >
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-[#526747]">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#d4e4bb]">
                <Zap size={12} fill="currentColor" />
              </span>
              YOUR EVERYDAY, UPGRADED
            </div>
            <h1
              id="welcome-title"
              className="mt-7 text-4xl leading-[1.1] font-semibold tracking-[-0.055em] sm:text-5xl"
            >
              Good to have
              <br />
              you{" "}
              <span className="font-serif font-normal italic text-[#657e50]">
                back.
              </span>
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#64705b]">
              Your next favorite find is just a sign-in away. Let’s make your
              everyday a little better.
            </p>

            <div
              aria-hidden="true"
              className="relative my-7 hidden h-56 items-center justify-center sm:flex lg:my-9 lg:h-60"
            >
              <div className="absolute size-60 rounded-full border border-[#c9d7b7]" />
              <div className="absolute size-46 rounded-full border border-[#c9d7b7]" />
              <div className="absolute size-32 rounded-full bg-[#d6e4c2]" />
              <div className="relative -rotate-12 rounded-[38px] border border-white/30 bg-[#243b2e] p-7 shadow-[10px_22px_35px_-12px_#243b2e70]">
                <Headphones
                  size={112}
                  strokeWidth={1.1}
                  className="text-[#d1edaa]"
                />
              </div>
              <div className="absolute top-2 right-3 rotate-12 rounded-2xl border border-white/70 bg-white/65 p-3 text-[#627d4c] shadow-sm backdrop-blur-sm sm:right-7">
                <AudioLines size={26} strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-0 left-0 -rotate-6 rounded-xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <Sparkles size={14} className="text-[#6f8c50]" /> A little
                  upgrade. A big difference.
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-[#cbd7bd] pt-5 sm:mt-auto">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dbe7cb] text-[#567044]">
                <ShieldCheck size={20} strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-xs font-semibold">
                  Your favorites. All in one place.
                </p>
                <p className="mt-1 text-[11px] text-[#64705b]">
                  Discover, shop, and pick up where you left off.
                </p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="signin-title"
            className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-14"
          >
            <div className="mb-7 flex size-12 items-center justify-center rounded-2xl border border-[#e4e9dc] bg-[#f3f6ed] text-[#5a7546]">
              <LockKeyhole size={22} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#718361]">
              MAKE YOURSELF AT HOME
            </p>
            <h2
              id="signin-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
            >
              Sign in to TechMart
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#7a8274]">
              A familiar place for your next new thing.
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
                    className="pointer-events-none absolute top-[19px] left-4 text-[#8a957e]"
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

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold"
                >
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute top-[19px] left-4 text-[#8a957e]"
                  />
                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-lg text-[#7a8770] transition hover:bg-[#edf2e5] focus-visible:outline-2 focus-visible:outline-[#67834e]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-2 text-xs text-red-600"
                  >
                    {errors.password.message}
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
                    Signing you in…
                  </>
                ) : (
                  <>
                    Sign in{" "}
                    <ArrowRight
                      size={17}
                      className="transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

               <p className="mt-6 text-center text-xs leading-6 text-[#7a8274]">
             Create account ?  
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1 font-semibold text-[#4f693d] underline-offset-4 hover:underline"
              >
                 Sign up <ArrowRight size={12} />
              </Link>
            </p>

               <p className="mt-6 text-center text-xs leading-6 text-[#7a8274]">
            Forget password ?  
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1 font-semibold text-[#4f693d] underline-offset-4 hover:underline"
              >
                 Rest password <ArrowRight size={12} />
              </Link>
            </p>

            <div className="mt-7 flex items-center gap-3 text-[10px] text-[#909887]">
              <span className="h-px flex-1 bg-[#e7eadf]" /> A LITTLE MORE
              POSSIBILITY <span className="h-px flex-1 bg-[#e7eadf]" />
            </div>
            <p className="mt-6 text-center text-xs leading-6 text-[#7a8274]">
              Just looking around?{" "}
              <Link
                href="/products"
                className="inline-flex items-center gap-1 font-semibold text-[#4f693d] underline-offset-4 hover:underline"
              >
                Explore the collection <ArrowRight size={12} />
              </Link>
            </p>
            <p className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-[#858e7b]">
              <ShieldCheck size={13} /> Welcome back to your everyday favorites.
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

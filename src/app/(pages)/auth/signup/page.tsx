"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import { signIn } from "next-auth/react";
import  apiServices  from '@/services/apiServices';
import { name } from "next/dist/server/ci-info";

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(60, "That name is a little too long."),
    email: z
      .string()
      .trim()
      .min(1, "Please enter your email address.")
      .email("Please enter a valid email address."),
    phone: z
      .string()
      .trim()
      .regex(/^01[0125]\d{8}$/, "Enter a valid Egyptian mobile number."),
    password: z.string().min(8, "Use at least 8 characters."),
    rePassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

const perks = [
  { icon: ShoppingBag, label: "Your cart, saved for later" },
  { icon: PackageCheck, label: "Track every order in one place" },
  { icon: Sparkles, label: "Early access to new arrivals" },
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
  });

  const password = watch("password");

  async function onSubmit(values: SignupValues) {
 const response = await apiServices.signup(
    values.name,
    values.email,
    values.password,
    values.rePassword,
    values.phone
  );
    

    const succeeded = [response.message, response.statusMsg].some(
      (message) => message?.toLowerCase() === "success",
    );

    if (!succeeded) {
      setError("root", {
        message:
          response.message && response.message !== "fail"
            ? response.message
            : "We couldn't create your account. Please try again.",
      });
      return;
    }

    // The account exists now, so sign straight in and drop the user into the shop.
    const login = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    router.push(login?.ok && !login?.error ? "/products" : "/auth/signin");
  }

  const inputClass =
    "h-14 w-full rounded-xl border border-[#dfe4da] bg-[#fafbf8] pr-12 pl-12 text-sm text-[#20332a] outline-none transition placeholder:text-[#92998d] hover:border-[#b7c4ac] focus:border-[#67834e] focus:bg-white focus:ring-4 focus:ring-[#dce9ca]/60 aria-invalid:border-red-400 aria-invalid:focus:ring-red-100 disabled:opacity-60";

  const iconClass =
    "pointer-events-none absolute top-[19px] left-4 text-[#8a957e]";

  const toggleClass =
    "absolute top-2 right-2 flex size-10 items-center justify-center rounded-lg text-[#7a8770] transition hover:bg-[#edf2e5] focus-visible:outline-2 focus-visible:outline-[#67834e]";

  const labelClass = "mb-2 block text-xs font-semibold";
  const errorClass = "mt-2 text-xs text-red-600";

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
              A better everyday
              <br />
              starts{" "}
              <span className="font-serif font-normal italic text-[#657e50]">
                here.
              </span>
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#64705b]">
              Create your account and keep your favourites, your cart, and your
              orders waiting for you.
            </p>

            <div
              aria-hidden="true"
              className="relative my-7 hidden h-52 items-center justify-center sm:flex lg:my-8 lg:h-56"
            >
              <div className="absolute size-56 rounded-full border border-[#c9d7b7]" />
              <div className="absolute size-42 rounded-full border border-[#c9d7b7]" />
              <div className="absolute size-28 rounded-full bg-[#d6e4c2]" />
              <div className="relative rotate-3 rounded-[34px] border border-white/30 bg-[#243b2e] px-7 py-8 shadow-[10px_22px_35px_-12px_#243b2e70]">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#d1edaa] text-[#2c4536]">
                    <UserPlus size={20} strokeWidth={1.6} />
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
              </div>
              <div className="absolute top-1 right-2 -rotate-6 rounded-2xl border border-white/70 bg-white/70 p-3 text-[#627d4c] shadow-sm backdrop-blur-sm sm:right-6">
                <PackageCheck size={24} strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-0 left-0 rotate-3 rounded-xl border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <Sparkles size={14} className="text-[#6f8c50]" /> One account.
                  Every good find.
                </div>
              </div>
            </div>

            <ul className="mt-8 space-y-3 border-t border-[#cbd7bd] pt-5 sm:mt-auto">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-xs">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#dbe7cb] text-[#567044]">
                    <Check size={14} strokeWidth={2.4} />
                  </span>
                  <span className="font-medium text-[#4f5f47]">{label}</span>
                  <Icon aria-hidden="true" size={14} className="ml-auto text-[#93a286]" />
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="signup-title"
            className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-14"
          >
            <div className="mb-7 flex size-12 items-center justify-center rounded-2xl border border-[#e4e9dc] bg-[#f3f6ed] text-[#5a7546]">
              <UserPlus size={22} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#718361]">
              MAKE YOURSELF AT HOME
            </p>
            <h2
              id="signup-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
            >
              Create your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#7a8274]">
              A few details and you&apos;re in.
            </p>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
              aria-busy={isSubmitting}
            >
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <div className="relative">
                  <User aria-hidden="true" size={18} strokeWidth={1.5} className={iconClass} />
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="User Name"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" role="alert" className={errorClass}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
                <div className="relative">
                  <Mail aria-hidden="true" size={18} strokeWidth={1.5} className={iconClass} />
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
                  <p id="email-error" role="alert" className={errorClass}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone number
                </label>
                <div className="relative">
                  <Phone aria-hidden="true" size={18} strokeWidth={1.5} className={iconClass} />
                  <input
                    {...register("phone")}
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="01012345678"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={inputClass}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" role="alert" className={errorClass}>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.5}
                      className={iconClass}
                    />
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      className={`${inputClass} pr-12 text-sm`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className={toggleClass}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" role="alert" className={errorClass}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="rePassword" className={labelClass}>
                    Confirm password
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.5}
                      className={iconClass}
                    />
                    <input
                      {...register("rePassword")}
                      id="rePassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.rePassword}
                      aria-describedby={errors.rePassword ? "rePassword-error" : undefined}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      aria-pressed={showConfirm}
                      className={toggleClass}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.rePassword && (
                    <p id="rePassword-error" role="alert" className={errorClass}>
                      {errors.rePassword.message}
                    </p>
                  )}
                </div>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#7a8274]">
                <li className="flex items-center gap-1.5">
                  <Check
                    size={13}
                    strokeWidth={2.5}
                    className={
                      password.length >= 8 ? "text-[#67834e]" : "text-[#c3c9bb]"
                    }
                  />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-1.5">
                  <Check
                    size={13}
                    strokeWidth={2.5}
                    className={
                      /\d/.test(password) ? "text-[#67834e]" : "text-[#c3c9bb]"
                    }
                  />
                  A number
                </li>
              </ul>

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
                    <LoaderCircle size={18} className="motion-safe:animate-spin" />{" "}
                    Creating your account…
                  </>
                ) : (
                  <>
                    Create account{" "}
                    <ArrowRight
                      size={17}
                      className="transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 flex items-center gap-3 text-[10px] text-[#909887]">
              <span className="h-px flex-1 bg-[#e7eadf]" /> A LITTLE MORE
              POSSIBILITY <span className="h-px flex-1 bg-[#e7eadf]" />
            </div>
            <p className="mt-6 text-center text-xs leading-6 text-[#7a8274]">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1 font-semibold text-[#4f693d] underline-offset-4 hover:underline"
              >
                Sign in <ArrowRight size={12} />
              </Link>
            </p>
            <p className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-[#858e7b]">
              <ShieldCheck size={13} /> No spam. Just the good stuff.
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

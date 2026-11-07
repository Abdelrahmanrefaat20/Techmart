"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/toast";
import apiServices from "@/services/apiServices";
import { useSession } from "next-auth/react";
import { useParams , useRouter } from "next/navigation";
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

const fieldClass =
  "w-full rounded-2xl border border-neutral-200 bg-[#faf9f6] text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-[background-color,border-color,box-shadow] duration-200 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/10 aria-invalid:border-red-400 aria-invalid:bg-red-50/40 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10";

const checkoutSchema = z.object({
  city: z.string().min(1, "Please select your city."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(
      /^01[0125]\d{8}$/,
      "Enter a valid Egyptian mobile number, like 01010700999.",
    ),
// postalCode: z
//   .string()
//   .optional(),
  paymentMethod: z.enum(["cash", "online"]),
  details: z
    .string()
    .trim()
    .min(5, "Please add a little more detail, at least 5 characters.")
    .max(200, "Address details cannot exceed 200 characters."),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const cities = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Port Said",
  "Suez",
  "Dakahlia",
  "Sharqia",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Kafr El Sheikh",
  "Damietta",
  "Ismailia",
  "Faiyum",
  "Beni Suef",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "New Valley",
  "Matrouh",
  "North Sinai",
  "South Sinai",
];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-start gap-1.5 text-xs text-red-600"
    >
      <AlertCircle size={14} aria-hidden="true" className="mt-px shrink-0" />
      {message}
    </p>
  );
}

export default function Checkout() {
   const route = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      details: "",
      phone: "",
      city: "",
      // postalCode: "",
      paymentMethod: "online",
    },
  });

  const { cartId } = useParams();
  const { data: session } = useSession();

  const shippingAddress = useWatch({ control });
  const detailsLeft = 200 - (shippingAddress.details?.length ?? 0);

  async function onSubmit(values: CheckoutValues) {

    try {
      const token = session?.user?.token;

      if (!token) {
        toast.add({
          title: "Authentication required",
          description: "Please log in before checking out.",
          type: "error",
        });
        return;
      }

      const shippingAddress = {
        details: values.details,
        phone: values.phone,
        city: values.city,
        // postalCode: values.postalCode ? Number(values.postalCode) : undefined,
      };

      if (values.paymentMethod === "cash") {
        const response = await apiServices.createCashOrder(
          cartId as string,
          shippingAddress,
          token,
        );

        if (response.status === "success") {
          toast.add({
            title: "Order created successfully",
            description: "Your order has been placed with cash on delivery.",
            type: "success",
          });
          console.log("Cash order response:", response);
          route.push("/allorders")
        }

        return;
      }

      const response = await apiServices.checkoutCart(
        cartId as string,
        shippingAddress,
        token,
      );

      open(response.session.url, "_self");
    } catch (error) {
      console.error(error);

      toast.add({
        title: "Checkout failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  }

  return (
    <main className="min-h-[60vh] bg-[#faf9f6] text-[#171717]">
      <div className="container px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:pb-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-neutral-500"
        >
          <Link
            href="/"
            className={`transition-colors hover:text-black ${focus}`}
          >
            Home
          </Link>
          <ChevronRight size={15} aria-hidden="true" />
          <Link
            href="/cart"
            className={`transition-colors hover:text-black ${focus}`}
          >
            Cart
          </Link>
          <ChevronRight size={15} aria-hidden="true" />
          <span aria-current="page" className="text-neutral-900">
            Checkout
          </span>
        </nav>

        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-[-0.06em] sm:text-4xl lg:text-[42px]">
              CHECKOUT
            </h1>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              Almost there. Add your delivery details and we will take care of
              the rest.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600">
            <ShieldCheck size={16} aria-hidden="true" />
            Secure checkout
          </span>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)] lg:gap-6">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-[22px] border border-neutral-200 bg-white p-5 sm:p-7 lg:p-8"
          >
            <div className="mb-7 flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#1d2c26] text-[#d1f391]">
                <MapPin size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Shipping address
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="city"
                    autoComplete="address-level2"
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? "city-error" : undefined}
                    className={`${fieldClass} h-13 appearance-none px-4 pr-11 ${
                      shippingAddress.city ? "" : "text-neutral-400"
                    }`}
                    {...register("city")}
                  >
                    <option value="" disabled>
                      Select your city
                    </option>
                    {cities.map((city) => (
                      <option
                        key={city}
                        value={city}
                        className="text-neutral-900"
                      >
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                </div>
                <FieldError id="city-error" message={errors.city?.message} />
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01010700999"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone ? "phone-error" : "phone-note"
                    }
                    className={`${fieldClass} h-13 pl-11 pr-4`}
                    {...register("phone")}
                  />
                </div>
                {errors.phone ? (
                  <FieldError id="phone-error" message={errors.phone.message} />
                ) : (
                  <p id="phone-note" className="mt-2 text-xs text-neutral-500">
                    We only use this number to confirm delivery.
                  </p>
                )}
              </div>

              {/* <div className="sm:col-span-1">
                <label
                  htmlFor="postalCode"
                  className="mb-2 block text-sm font-medium"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="12345"
                  className={`${fieldClass} h-13 px-4`}
                  {...register("postalCode")}
                />
              </div> */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="details"
                  className="mb-2 block text-sm font-medium"
                >
                  Address details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="details"
                  rows={4}
                  maxLength={200}
                  autoComplete="street-address"
                  placeholder="Street, building, apartment, floor, or a nearby landmark"
                  aria-invalid={Boolean(errors.details)}
                  aria-describedby={`details-note details-count${
                    errors.details ? " details-error" : ""
                  }`}
                  className={`${fieldClass} min-h-32 resize-y px-4 py-3.5 leading-relaxed`}
                  {...register("details")}
                />
                <FieldError
                  id="details-error"
                  message={errors.details?.message}
                />
                <div className="mt-2 flex flex-wrap items-start justify-between gap-2 text-xs text-neutral-500">
                  <p id="details-note">
                    Add any detail that helps the courier find you faster.
                  </p>
                  <p
                    id="details-count"
                    aria-live="polite"
                    className="tabular-nums text-neutral-400"
                  >
                    {detailsLeft} characters left
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold">Payment method</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-[#faf9f6] p-4 transition-colors has-[:checked]:border-black has-[:checked]:bg-neutral-50">
                  <input
                    type="radio"
                    value="cash"
                    className="size-4 accent-black"
                    {...register("paymentMethod")}
                  />

                  <div>
                    <p className="text-sm font-semibold">Cash on delivery</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-[#faf9f6] p-4 transition-colors has-[:checked]:border-black has-[:checked]:bg-neutral-50">
                  <input
                    type="radio"
                    value="online"
                    className="size-4 accent-black"
                    {...register("paymentMethod")}
                  />

                  <div>
                    <p className="text-sm font-semibold">Online payment</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Pay securely using your card.
                    </p>
                  </div>
                </label>
              </div>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <Link
                href="/cart"
                className={`flex min-h-13 items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 text-sm font-medium transition-colors hover:bg-[#faf9f6] ${focus}`}
              >
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="rotate-180"
                />
                Back to cart
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group flex min-h-13 flex-1 items-center justify-center gap-3 rounded-full bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
              >
                {isSubmitting
                  ? "Processing order..."
                  : shippingAddress.paymentMethod === "cash"
                    ? "Place order"
                    : "Continue to payment"}
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-neutral-500 sm:text-right">
              You will not be charged until your order is confirmed.
            </p>
          </form>

          <aside aria-label="Delivery summary" className="lg:sticky lg:top-32">
            <div className="rounded-[22px] border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-tight">
                  Delivery details
                </h2>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
                  Live preview
                </span>
              </div>

              <dl className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-400">
                    <MapPin size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wide text-neutral-400">
                      City
                    </dt>
                    <dd className="mt-0.5 font-medium break-words">
                      {shippingAddress.city || (
                        <span className="font-normal text-neutral-400">
                          Not set yet
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-400">
                    <Phone size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wide text-neutral-400">
                      Phone
                    </dt>
                    <dd className="mt-0.5 font-medium break-words tabular-nums">
                      {shippingAddress.phone || (
                        <span className="font-normal text-neutral-400">
                          Not set yet
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-dashed border-neutral-200 pt-4">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#faf9f6] text-neutral-400">
                    <MapPin size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wide text-neutral-400">
                      Address
                    </dt>
                    <dd className="mt-0.5 leading-relaxed break-words">
                      {shippingAddress.details || (
                        <span className="text-neutral-400">
                          Your full address will appear here.
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="mt-4 rounded-[22px] bg-[#1d2c26] p-5 text-white sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d1f391]">
                  <Truck size={19} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Cash on delivery</p>
                  <p className="text-xs text-white/60">
                    Pay when your order arrives.
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-white/10" />

              <ul className="space-y-3 text-xs leading-relaxed text-white/70">
                <li className="flex gap-2.5">
                  <ShieldCheck
                    size={16}
                    aria-hidden="true"
                    className="mt-px shrink-0 text-[#d1f391]"
                  />
                  Your details are only used to deliver this order.
                </li>
                <li className="flex gap-2.5">
                  <Truck
                    size={16}
                    aria-hidden="true"
                    className="mt-px shrink-0 text-[#d1f391]"
                  />
                  Delivery time is confirmed by phone before dispatch.
                </li>
              </ul>
            </div>

            <p className="mt-4 px-1 text-center text-xs text-neutral-500">
              Need help with your order?{" "}
              <Link
                href="/Profile"
                className={`font-medium text-neutral-900 underline underline-offset-2 ${focus}`}
              >
                Contact support
              </Link>
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

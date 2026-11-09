
"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import apiServices from "@/services/apiServices";

const fieldClass =
  "w-full rounded-2xl border border-neutral-200 bg-[#faf9f6] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-[background-color,border-color,box-shadow] duration-200 focus:border-[#1d2c26] focus:bg-white focus:ring-4 focus:ring-[#1d2c26]/10";

const labelClass = "mb-1.5 block text-xs font-medium text-neutral-600";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    password: z.string().min(8, "Use at least 8 characters."),
    rePassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const { data: session, status } = useSession();

  const token = session?.user?.token;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordValues) {


    try {
      await apiServices.changePassword(
        values.currentPassword,
        values.password,
        values.rePassword,
        token!
      );

      toast.add({
        title: "Password updated",
        description: "Your password has been changed successfully.",
        type: "success",
      });

      reset();
    } catch (error) {
      toast.add({
        title: "Password change failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 space-y-4"
    >
      <div>
        <label htmlFor="current-password" className={labelClass}>
          Current password
        </label>

        <input
          {...register("currentPassword")}
          id="current-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your current password"
          className={fieldClass}
        />

        {errors.currentPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="new-password" className={labelClass}>
            New password
          </label>

          <input
            {...register("password")}
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className={fieldClass}
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className={labelClass}>
            Confirm new password
          </label>

          <input
            {...register("rePassword")}
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your new password"
            className={fieldClass}
          />

          {errors.rePassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.rePassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="flex items-center gap-1.5 text-xs text-neutral-400">
          <KeyRound size={13} aria-hidden="true" />
          Keep your password secure.
        </p>

        <Button
          type="submit"
          disabled={isSubmitting || status === "loading"}
          className="rounded-full bg-[#1d2c26] px-5 text-white hover:bg-[#2b4136]"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </div>
    </form>
  );
}

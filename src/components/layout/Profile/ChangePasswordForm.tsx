"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useAuthToken } from "@/hooks/useAuthToken";
import apiServices from "@/services/apiServices";

const fieldClass =
  "w-full rounded-2xl border border-neutral-200 bg-[#faf9f6] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-[background-color,border-color,box-shadow] duration-200 focus:border-[#1d2c26] focus:bg-white focus:ring-4 focus:ring-[#1d2c26]/10 disabled:opacity-60";

const labelClass = "mb-1.5 block text-xs font-medium text-neutral-600";
const errorClass = "mt-1 text-xs text-red-600";

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
  const { status, token, isLoading, isAuthenticated, setToken } = useAuthToken();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordValues) {
    // The session is still resolving — never call the API with a missing token.
    if (isLoading) {
      toast.add({
        title: "One moment",
        description: "We're still checking your session. Try again shortly.",
        type: "info",
      });
      return;
    }

   
    if (status !== "authenticated" || !token) {
      toast.add({
        title: "Please sign in",
        description: "Sign in again to change your password.",
        type: "error",
      });
      return;
    }

    try {
      const response = await apiServices.changePassword(
        token,
        values.currentPassword,
        values.password,
        values.rePassword,
      );

      const succeeded =
        response.message === "success" || response.statusMsg === "success";

      if (!succeeded) {
        toast.add({
          title: "Password change failed",
          description:
            response.message && response.message !== "fail"
              ? response.message
              : "Please check your current password and try again.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Password updated",
        description: "Your password has been changed successfully.",
        type: "success",
      });

      // The API invalidates the old JWT for sensitive endpoints and returns a
      // new one; keep the session in sync so the next request still works.
      if (response.token) {
        try {
          await setToken(response.token);
        } catch {
          // A failed session refresh must not hide the successful change.
        }
      }

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
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 space-y-4"
      aria-busy={isSubmitting}
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
          disabled={isSubmitting}
          aria-invalid={!!errors.currentPassword}
          aria-describedby={
            errors.currentPassword ? "current-password-error" : undefined
          }
          className={fieldClass}
        />

        {errors.currentPassword && (
          <p id="current-password-error" role="alert" className={errorClass}>
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
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "new-password-error" : undefined
            }
            className={fieldClass}
          />

          {errors.password && (
            <p id="new-password-error" role="alert" className={errorClass}>
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
            placeholder="Repeat the new password"
            disabled={isSubmitting}
            aria-invalid={!!errors.rePassword}
            aria-describedby={
              errors.rePassword ? "confirm-password-error" : undefined
            }
            className={fieldClass}
          />

          {errors.rePassword && (
            <p id="confirm-password-error" role="alert" className={errorClass}>
              {errors.rePassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="flex items-center gap-1.5 text-xs text-neutral-400">
          <KeyRound size={13} aria-hidden="true" />
          {isLoading
            ? "Checking your session…"
            : isAuthenticated
              ? "Keep your password secure."
              : "Sign in to change your password."}
        </p>

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="rounded-full bg-[#1d2c26] px-5 text-white hover:bg-[#2b4136]"
        >
          {isSubmitting
            ? "Updating..."
            : isLoading
              ? "Checking session…"
              : "Update password"}
        </Button>
      </div>
    </form>
  );
}

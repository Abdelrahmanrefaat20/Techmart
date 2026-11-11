"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Star, Trash2 } from "lucide-react";

import { toast } from "@/components/ui/toast";
import { useAuthToken } from "@/hooks/useAuthToken";
import { cn } from "@/lib/utils";
import apiServices from "@/services/apiServices";
import type { ReviewI } from "@/interfaces/review";

const eyebrowClass =
  "text-[11px] font-semibold tracking-[0.16em] text-red-500 uppercase";

const destructiveButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:pointer-events-none disabled:opacity-60";

const secondaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium text-[#1d2c26] transition-colors hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d2c26] disabled:pointer-events-none disabled:opacity-60";

type DeleteReviewProps = {
  review: ReviewI;
  onDeleted: () => void;
  onCancel: () => void;
};

function Stars({ value }: { value: number }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of 5`}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            index < value
              ? "fill-amber-400 text-amber-400"
              : "text-neutral-300",
          )}
        />
      ))}
    </span>
  );
}

export default function DeleteReview({
  review,
  onDeleted,
  onCancel,
}: DeleteReviewProps) {
  const { token, isAuthenticated, isLoading: isSessionLoading } = useAuthToken();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isSessionLoading) {
      toast.add({
        title: "One moment",
        description: "We’re still checking your session.",
        type: "info",
      });
      return;
    }

    if (!isAuthenticated || !token) {
      toast.add({
        title: "Please sign in",
        description: "Sign in to delete your review.",
        type: "error",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const result = await apiServices.deleteReview(token, review._id);

      if (!result.ok) {
        toast.add({
          title: "Review not deleted",
          description:
            result.message ||
            "You can only delete your own review. Please try again.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Review deleted",
        description: "Your review has been removed.",
        type: "success",
      });

      onDeleted();
    } catch {
      toast.add({
        title: "Review not deleted",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section
      aria-labelledby="delete-review-heading"
      className="relative mx-auto mt-6 max-w-xl overflow-hidden rounded-[26px] border border-red-100 bg-white p-5 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-12 size-44 rounded-full bg-red-100/70 blur-3xl"
      />

      <div className="relative flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 size={20} aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <p className={eyebrowClass}>Delete</p>
          <h2
            id="delete-review-heading"
            className="mt-1 text-xl font-semibold tracking-tight"
          >
            Remove this{" "}
            <span className="font-serif font-normal italic text-red-600">
              review?
            </span>
          </h2>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            This permanently deletes your review and its rating. It cannot be
            undone.
          </p>
        </div>
      </div>

      <div className="relative mt-4 rounded-2xl border border-neutral-200 bg-[#faf9f6] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-[#4d6b2f]">
            Your review
          </p>
          <Stars value={review.rating} />
        </div>
        <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-neutral-500">
          {review.review}
        </p>
      </div>

      <p className="relative mt-4 flex items-start gap-2 rounded-2xl bg-red-50/70 px-4 py-3 text-xs leading-5 text-red-700">
        <AlertTriangle
          size={14}
          aria-hidden="true"
          className="mt-0.5 shrink-0"
        />
        This action cannot be undone. You can always write a new review later.
      </p>

      <div className="relative mt-5 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className={secondaryButtonClass}
        >
          Keep review
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isSessionLoading}
          className={destructiveButtonClass}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="size-4" aria-hidden="true" />
          )}
          {isDeleting ? "Deleting…" : "Delete review"}
        </button>
      </div>
    </section>
  );
}

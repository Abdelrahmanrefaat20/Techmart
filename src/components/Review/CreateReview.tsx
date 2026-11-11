"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Loader2, MessageSquarePlus, Send, Star } from "lucide-react";

import { toast } from "@/components/ui/toast";
import { useAuthToken } from "@/hooks/useAuthToken";
import { cn } from "@/lib/utils";
import apiServices from "@/services/apiServices";

const eyebrowClass =
  "text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase";

const fieldClass =
  "w-full rounded-2xl border border-neutral-200 bg-[#faf9f6] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-[background-color,border-color,box-shadow] duration-200 focus:border-[#1d2c26] focus:bg-white focus:ring-4 focus:ring-[#1d2c26]/10 disabled:opacity-60";

const labelClass = "mb-1.5 block text-xs font-medium text-neutral-600";

const primaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full bg-[#1d2c26] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2b4136] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d2c26] disabled:pointer-events-none disabled:opacity-60";

const secondaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium text-[#1d2c26] transition-colors hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d2c26] disabled:pointer-events-none disabled:opacity-60";

type CreateReviewProps = {
  productId: string;
  onCreated: () => void;
  onCancel: () => void;
};

export default function CreateReview({
  productId,
  onCreated,
  onCancel,
}: CreateReviewProps) {
  const { token, isAuthenticated, isLoading: isSessionLoading } = useAuthToken();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeRating = hoverRating || rating;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
        description: "Sign in to write a review.",
        type: "error",
      });
      return;
    }

    if (rating < 1) {
      setFormError("Choose a star rating first.");
      return;
    }

    if (review.trim().length < 3) {
      setFormError("Write a few words about the product.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const result = await apiServices.createReview(
        token,
        productId,
        review.trim(),
        rating,
      );

      if (!result.ok) {
        toast.add({
          title: "Review not posted",
          description:
            result.message ||
            "You may have already reviewed this product. Edit your existing review instead.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Review posted",
        description: "Thanks for sharing your thoughts.",
        type: "success",
      });

      setRating(0);
      setHoverRating(0);
      setReview("");
      onCreated();
    } catch {
      toast.add({
        title: "Review not posted",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="write-review-heading"
      className="mt-6 rounded-[26px] border border-neutral-200 bg-white p-5 sm:p-6"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className={eyebrowClass}>Your turn</p>
          <h2
            id="write-review-heading"
            className="mt-1 text-xl font-semibold tracking-tight"
          >
            Write a{" "}
            <span className="font-serif font-normal italic text-[#4d6b2f]">
              review
            </span>
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Tell the next buyer what you actually think.
          </p>
        </div>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eaf1e0] text-[#4d6b2f]">
          <MessageSquarePlus size={18} aria-hidden="true" />
        </span>
      </header>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <div>
          <span className={labelClass}>Your rating</span>

          <div
            className="flex flex-wrap items-center gap-3"
            onMouseLeave={() => setHoverRating(0)}
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setRating(index + 1);
                    setFormError(null);
                  }}
                  onMouseEnter={() => setHoverRating(index + 1)}
                  onFocus={() => setHoverRating(index + 1)}
                  onBlur={() => setHoverRating(0)}
                  aria-label={`Rate ${index + 1} out of 5`}
                  aria-pressed={rating === index + 1}
                  disabled={isSubmitting}
                  className="rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d2c26] disabled:opacity-60"
                >
                  <Star
                    aria-hidden="true"
                    className={cn(
                      "size-6 transition-colors",
                      index < activeRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-300",
                    )}
                  />
                </button>
              ))}
            </div>

            <span className="text-xs text-neutral-400">
              {rating > 0 ? `You rated it ${rating} out of 5` : "Tap a star to rate"}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="review-body" className={labelClass}>
            Your review
          </label>
          <textarea
            id="review-body"
            rows={4}
            maxLength={500}
            value={review}
            onChange={(event) => {
              setReview(event.target.value);
              setFormError(null);
            }}
            disabled={isSubmitting}
            placeholder="What did you like or dislike? How are you using it?"
            className={cn(fieldClass, "resize-y leading-6")}
          />
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-xs text-neutral-400">
              Your review will be public once posted.
            </p>
            <p className="text-xs text-neutral-400">{review.length}/500</p>
          </div>
        </div>

        {formError && (
          <p role="alert" className="text-xs text-red-600">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={secondaryButtonClass}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isSessionLoading}
            className={primaryButtonClass}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
            {isSubmitting ? "Posting…" : "Post review"}
          </button>
        </div>
      </form>
    </section>
  );
}

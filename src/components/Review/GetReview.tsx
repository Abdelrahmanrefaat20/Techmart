"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MessageSquareQuote,
  Pencil,
  RotateCw,
  Star,
  Trash2,
} from "lucide-react";

import { toast } from "@/components/ui/toast";
import { useAuthToken } from "@/hooks/useAuthToken";
import { decodeJwtPayload } from "@/lib/jwt";
import { cn, formatDate } from "@/lib/utils";
import apiServices from "@/services/apiServices";
import type { ReviewI } from "@/interfaces/review";
import CreateReview from "./CreateReview";
import DeleteReview from "./DeleteReview";
import EditReview from "./EditReview";

const PAGE_SIZE = 6;

const eyebrowClass =
  "text-[11px] font-semibold tracking-[0.16em] text-[#63893d] uppercase";

const primaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full bg-[#1d2c26] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2b4136] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d2c26] disabled:pointer-events-none disabled:opacity-60";

const secondaryButtonClass =
  "inline-flex min-h-9 items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 text-xs font-medium text-[#1d2c26] transition-colors hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d2c26] disabled:pointer-events-none disabled:opacity-60";

const chipClass =
  "inline-flex h-8 items-center rounded-full border border-neutral-200 bg-white px-3.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-[#1d2c26]";

const activeChipClass =
  "inline-flex h-8 items-center rounded-full bg-[#1d2c26] px-3.5 text-xs font-medium text-white";

type PanelState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; review: ReviewI }
  | { type: "delete"; review: ReviewI };

type GetReviewProps = {
  productId: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
};

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of 5`}
      className={cn("flex items-center gap-0.5", className)}
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

function reviewerName(user: ReviewI["user"]) {
  return typeof user === "string" ? "TechMart shopper" : user.name;
}

function reviewerId(user: ReviewI["user"]) {
  return typeof user === "string" ? user : user._id;
}

function initialsOf(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "T";
}

export default function GetReview({
  productId,
  ratingsAverage = 0,
  ratingsQuantity = 0,
}: GetReviewProps) {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: isSessionLoading } = useAuthToken();

  const [reviews, setReviews] = useState<ReviewI[]>([]);
  const [total, setTotal] = useState(ratingsQuantity);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [panel, setPanel] = useState<PanelState>({ type: "none" });

  const currentUserId = useMemo(() => {
    if (!token) {
      return null;
    }

    return decodeJwtPayload<{ id?: string }>(token)?.id ?? null;
  }, [token]);

  const loadPage = useCallback(
    async (targetPage: number, mode: "replace" | "append") => {
      try {
        const result = await apiServices.getProductReviews(
          productId,
          targetPage,
          PAGE_SIZE,
        );
        const items = Array.isArray(result.data) ? result.data : [];

        setReviews((previous) =>
          mode === "replace" ? items : [...previous, ...items],
        );
        setTotal(
          typeof result.results === "number" ? result.results : items.length,
        );
        setPage(targetPage);
        setHasMore(Boolean(result.metadata?.nextPage));
        setError(null);
      } catch {
        setError("We couldn’t load the reviews right now.");
      }
    },
    [productId],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        await loadPage(1, "replace");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitial();

    return () => {
      cancelled = true;
    };
  }, [loadPage]);

  useEffect(() => {
    if (panel.type === "none") {
      return;
    }

    document
      .getElementById("review-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [panel]);

  const ownReview = useMemo(
    () =>
      reviews.find(
        (item) =>
          currentUserId !== null && reviewerId(item.user) === currentUserId,
      ),
    [reviews, currentUserId],
  );

  const averageRating =
    ratingsAverage > 0
      ? ratingsAverage
      : reviews.length > 0
        ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        : 0;

  const reviewCount = total || ratingsQuantity || reviews.length;

  const breakdown = useMemo(() => {
    const loaded = reviews.length;

    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((item) => item.rating === stars).length;

      return {
        stars,
        count,
        percent: loaded > 0 ? Math.round((count / loaded) * 100) : 0,
      };
    });
  }, [reviews]);

  const visibleReviews =
    starFilter === null
      ? reviews
      : reviews.filter((item) => item.rating === starFilter);

  function openCreate() {
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
      router.push("/auth/signin");
      return;
    }

    setPanel({ type: "create" });
  }

  function closePanel() {
    setPanel({ type: "none" });
  }

  function handleChanged() {
    setPanel({ type: "none" });
    setStarFilter(null);
    void loadPage(1, "replace");
  }

  function handleRetry() {
    setIsLoading(true);
    void loadPage(1, "replace").finally(() => setIsLoading(false));
  }

  function handleLoadMore() {
    setIsLoadingMore(true);
    void loadPage(page + 1, "append").finally(() => setIsLoadingMore(false));
  }

  return (
    <section aria-labelledby="reviews-heading" className="mt-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={eyebrowClass}>Reviews</p>
          <h2
            id="reviews-heading"
            className="mt-1 font-heading text-2xl font-semibold tracking-tight"
          >
            What people are{" "}
            <span className="font-serif font-normal italic text-[#4d6b2f]">
              saying
            </span>
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Real notes from people who took this one home.
          </p>
        </div>

        <button
          type="button"
          onClick={
            ownReview ? () => setPanel({ type: "edit", review: ownReview }) : openCreate
          }
          className={primaryButtonClass}
        >
          <Pencil className="size-4" aria-hidden="true" />
          {ownReview ? "Edit your review" : "Write a review"}
        </button>
      </div>

      {/* Create / edit / delete panel */}
      {panel.type !== "none" && (
        <div id="review-panel" className="scroll-mt-24">
          {panel.type === "create" && (
            <CreateReview
              productId={productId}
              onCreated={handleChanged}
              onCancel={closePanel}
            />
          )}

          {panel.type === "edit" && (
            <EditReview
              review={panel.review}
              onUpdated={handleChanged}
              onCancel={closePanel}
            />
          )}

          {panel.type === "delete" && (
            <DeleteReview
              review={panel.review}
              onDeleted={handleChanged}
              onCancel={closePanel}
            />
          )}
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[300px_1fr] lg:gap-6">
        {/* Rating summary */}
        <aside className="relative isolate h-fit overflow-hidden rounded-[26px] bg-[#1d2c26] p-6 text-white lg:sticky lg:top-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-12 size-44 rounded-full bg-[#d1f391]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-12 size-44 rounded-full bg-[#63893d]/30 blur-3xl"
          />

          <p className="relative text-[11px] font-semibold tracking-[0.18em] text-[#d1f391] uppercase">
            Overall rating
          </p>

          <div className="relative mt-3 flex items-end gap-2">
            <span className="font-heading text-5xl leading-none font-semibold tracking-tight">
              {averageRating > 0 ? averageRating.toFixed(1) : "—"}
            </span>
            <span className="pb-1 text-sm text-white/50">out of 5</span>
          </div>

          <div className="relative mt-3 flex items-center gap-2">
            <Stars value={Math.round(averageRating)} />
            <span className="text-xs text-white/60">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="relative mt-6 space-y-2.5">
            {breakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-xs text-white/60">
                  {row.stars} star
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full bg-[#d1f391]"
                    style={{ width: `${row.percent}%` }}
                  />
                </span>
                <span className="w-7 shrink-0 text-right text-xs text-white/60">
                  {row.count}
                </span>
              </div>
            ))}
          </div>

          <p className="relative mt-6 border-t border-white/10 pt-4 text-xs text-white/50">
            {reviews.length < reviewCount
              ? `Bars reflect ${reviews.length} loaded ${
                  reviews.length === 1 ? "review" : "reviews"
                }.`
              : "Bars reflect every review for this product."}
          </p>
        </aside>

        {/* Reviews */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStarFilter(null)}
              className={starFilter === null ? activeChipClass : chipClass}
            >
              All reviews
            </button>

            {[5, 4, 3].map((stars) => (
              <button
                key={stars}
                type="button"
                onClick={() => setStarFilter(stars)}
                className={starFilter === stars ? activeChipClass : chipClass}
              >
                {stars} star
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-[26px] border border-neutral-200 bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-neutral-100" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 rounded-full bg-neutral-100" />
                      <div className="h-2.5 w-20 rounded-full bg-neutral-100" />
                    </div>
                  </div>
                  <div className="mt-4 h-3 w-full rounded-full bg-neutral-100" />
                  <div className="mt-2 h-3 w-4/5 rounded-full bg-neutral-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 rounded-[26px] border border-dashed border-neutral-300 bg-[#faf9f6] px-6 py-12 text-center">
              <p className="text-sm text-neutral-600">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className={secondaryButtonClass}
              >
                <RotateCw className="size-3.5" aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : visibleReviews.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[26px] border border-dashed border-neutral-300 bg-[#faf9f6] px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#eaf1e0] text-[#4d6b2f]">
                <MessageSquareQuote size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-[#1d2c26]">
                  {starFilter === null
                    ? "No reviews yet"
                    : `No ${starFilter}-star reviews loaded`}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {starFilter === null
                    ? "Be the first to share your thoughts on this product."
                    : "Try another rating filter."}
                </p>
              </div>

              {starFilter === null && (
                <button
                  type="button"
                  onClick={openCreate}
                  className={secondaryButtonClass}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Write the first review
                </button>
              )}
            </div>
          ) : (
            visibleReviews.map((review) => {
              const name = reviewerName(review.user);
              const isOwn =
                currentUserId !== null &&
                reviewerId(review.user) === currentUserId;
              const isEdited = review.updatedAt !== review.createdAt;

              return (
                <article
                  key={review._id}
                  className="rounded-[26px] border border-neutral-200 bg-white p-5"
                >
                  <header className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eaf1e0] text-xs font-semibold text-[#4d6b2f]">
                      {initialsOf(name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{name}</p>

                        {isOwn && (
                          <span className="rounded-full bg-[#eaf1e0] px-2 py-0.5 text-[10px] font-medium text-[#4d6b2f]">
                            Your review
                          </span>
                        )}

                        {isEdited && (
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                            Edited
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-neutral-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    <Stars value={review.rating} />
                  </header>

                  <p className="mt-3 text-sm leading-6 whitespace-pre-line text-neutral-500">
                    {review.review}
                  </p>

                  {isOwn && (
                    <footer className="mt-4 flex flex-wrap items-center justify-end gap-1 border-t border-neutral-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setPanel({ type: "edit", review })}
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-[#faf9f6] hover:text-[#1d2c26]"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setPanel({ type: "delete", review })}
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </footer>
                  )}
                </article>
              );
            })
          )}

          {!isLoading && !error && visibleReviews.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-dashed border-neutral-300 bg-[#faf9f6] px-5 py-4">
              <p className="text-xs text-neutral-500">
                Showing{" "}
                <span className="font-medium text-[#1d2c26]">
                  {visibleReviews.length}
                </span>{" "}
                of {reviewCount} reviews
              </p>

              {hasMore && starFilter === null && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={secondaryButtonClass}
                >
                  {isLoadingMore ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : null}
                  {isLoadingMore ? "Loading…" : "Load more reviews"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

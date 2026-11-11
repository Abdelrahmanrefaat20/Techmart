export interface ReviewUserI {
  _id: string;
  name: string;
}

export interface ReviewI {
  _id: string;
  review: string;
  rating: number;
  product: string;
  /** Populated in GET/PUT responses; a raw id right after POST. */
  user: ReviewUserI | string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsMetadataI {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
}

export type ProductReviewsResponse = {
  results: number;
  metadata?: ReviewsMetadataI;
  data: ReviewI[];
};

export type ReviewMutationResponse = {
  ok: boolean;
  data?: ReviewI;
  status?: string;
  message?: string;
};

import { Review } from "@prisma/client";

export function reviewString({ reviews }: { reviews: Review[] }) {
  const reviewsFiltered = reviews
    .filter((r) => Boolean(r.rating))
    .map((x) => x.rating);
  const averageReview =
    reviewsFiltered.length &&
    (Math.round(
      reviewsFiltered.reduce((a, c) => a + c, 0) /
        reviewsFiltered.filter((r) => r).length
    ) ||
      1); //round 0 back to 1
  const reviewString = averageReview
    ? Array(averageReview).fill("*")
    : "No Reviews";
  return reviewString;
}

export function calculateReviewRatingAverage(reviews: Review[]) {
  if (!reviews.length) {
    return 0;
  }
  return (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  )
}

export function renderRatingText(reviews: Review[]) {
  const rating = calculateReviewRatingAverage(reviews);
  switch (true) {
    case rating > 4: return "Awesome"
    case rating > 3: return "Good"
    case rating > 0: return "Average"
    default: return ""
  }
}

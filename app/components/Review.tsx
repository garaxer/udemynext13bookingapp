import { Review } from "@prisma/client";

export default function Review({ reviews }: { reviews: Review[] }) {
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

  return (
    <div className="flex items-start">
      <div className="flex mb-2">{reviewString}</div>
      <p className="ml-2">
        {reviews?.length ?? 0} review
        {(reviews?.length ?? 0) === 1 ? "" : "s"}
      </p>
    </div>
  );
}

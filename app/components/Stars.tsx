import { calculateReviewRatingAverage } from "@/utils/reviews";
import { Review } from "@prisma/client";
import Image from "next/image";
import emptyStar from "public/icons/empty-star.png";
import fullStar from "public/icons/full-star.png";
import halfStar from "public/icons/half-star.png";

export default function Stars({ reviews, rating }: { reviews: Review[], rating?: number }) {
  const reviewRating = rating || calculateReviewRatingAverage(reviews);

  const renderStars = Array(5).fill(0).map((_, i) => {
    const difference = parseFloat((reviewRating - i ).toFixed(1));
    switch (true) {
      case difference >= 1:
        return fullStar;
      case difference < 1 && difference > 0: {
        if (difference <= 0.2) {
          return emptyStar;
        } else if (difference > 0.2 && difference <= 0.6) {
          return halfStar;
        } else {
          return fullStar;
        }
      }
      default:
        return emptyStar;
    }
  });
  return (
    <>
      {reviewRating.toFixed(1)}
      {renderStars.map((star, i) => (
        <Image src={star} alt={"star icon"} key={star.src + i} className="w-4 h-4 mr-1"/>
      ))}
    </>
  );
}

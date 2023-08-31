import { PRICE, Location, Cuisine, Review } from "@prisma/client";
import Link from "next/link";
import Price from "./Price";

export type RestaurantCardType = {
  id: number;
  name: string;
  main_image: string;
  slug: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  reviews: Review[];
};

export type RestaurantCardProps = {
  restaurant: RestaurantCardType;
};
export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const reviews = restaurant.reviews
    .filter((r) => Boolean(r.rating))
    .map((x) => x.rating);
  const averageReview =
    reviews.length &&
    (Math.round(
      reviews.reduce((a, c) => a + c, 0) / reviews.filter((r) => r).length
    ) ||
      1); //round 0 back to 1
  const reviewString = averageReview
    ? Array(averageReview).fill("*")
    : "No Reviews";

  reviews.length && console.log(reviews);
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img src={restaurant.main_image} alt="" className="w-full h-36" />
        <div className="p-1 text-black">
          <h3 className="font-bold text-2xl mb-2">{restaurant.name}</h3>
          <div className="flex items-start">
            <div className="flex mb-2">{reviewString}</div>
            <p className="ml-2">{restaurant?.reviews?.length ?? 0} review{(restaurant?.reviews?.length ?? 0) === 1 ? 's' : ''}</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{restaurant.cuisine.name}</p>
            <Price price={restaurant.price} />
            <p>{restaurant.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
}

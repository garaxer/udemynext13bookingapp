import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";
import { SearchQueryParams } from "../page";

const prices = {
  [PRICE.CHEAP]: "$",
  [PRICE.REGULAR]: "$$",
  [PRICE.EXPENSIVE]: "$$$",
};

export default function SearchSideBar({
  locations,
  cuisines,
  searchParams,
}: {
  locations: Location[];
  cuisines: Cuisine[];
  searchParams: SearchQueryParams;
}) {
  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => {
          return (
            <Link
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  city: location.name,
                },
              }}
              key={location.id}
              className="font-light text-reg"
            >
              {location.name}
            </Link>
          );
        })}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => {
          return (
            <Link
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  cuisine: cuisine.name,
                },
              }}
              key={cuisine.id}
              className="font-light text-reg"
            >
              {cuisine.name}
            </Link>
          );
        })}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {Object.entries(prices).map(([price, label]) => (
            <Link
              key={price}
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  price,
                },
              }}
              className={`border w-full text-reg font-light text-center ${
                ["$", "$$$"].includes(label)
                  ? `rounded-${label === "$" ? "l" : "r"}`
                  : ""
              } p-2`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

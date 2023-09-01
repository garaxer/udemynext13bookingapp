import { PRICE, PrismaClient } from "@prisma/client";
import Header from "./components/Header";
import {
  RestaurantCardType,
} from "./components/RestaurantCard";
import RestaurantCard from "./components/RestaurantCard.1";
import SearchSideBar from "./components/SearchSideBar";

const prisma = new PrismaClient();

const findRestaurants = async ({
  city,
  cuisine,
  price,
}: SearchQueryParams): Promise<RestaurantCardType[] | null> => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    description: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  const restaurants = await prisma.restaurant.findMany({
    select,
    where: {
      ...(city && {
        location: {
          name: { equals: city.toLowerCase() },
        },
      }),
      ...(cuisine && {
        cuisine: {
          name: { equals: cuisine.toLowerCase() },
        },
      }),
      ...(price && { price: { equals: price } }),
    },
  });

  return restaurants;
};

const fetchLocations = () => {
  return prisma.location.findMany();
};
const fetchCuisines = () => {
  return prisma.cuisine.findMany();
};

export type SearchQueryParams = {
  city?: string;
  cuisine?: string;
  price?: PRICE;
};

async function Search({ searchParams }: { searchParams: SearchQueryParams }) {
  const restaurants = await findRestaurants(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {!restaurants || !restaurants.length ? (
            <p>No restaurants found, please search again!</p>
          ) : (
            restaurants.map((r) => {
              return <RestaurantCard restaurant={r} key={r.id} />;
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Search;

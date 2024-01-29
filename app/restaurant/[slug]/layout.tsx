import { ReactNode } from "react";
import Header from "./components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrailerBook",
  description: "Book a trailer",
};

export default function RestaurantLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  return (
    <>
      <Header name={params.slug} />
      <div className="flex gap-2 flex-col-reverse lg:flex-row m-auto lg:justify-around items-start 0 -mt-11">
        {children}
      </div>
    </>
  );
}

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
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        {children}
      </div>
    </>
  );
}

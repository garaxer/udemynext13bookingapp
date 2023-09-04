"use client";
import Image from "next/image";
import errorImage from "public/icons/error.png";

export default function Error() {
  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <Image src={errorImage} alt={"error"} />
      <div className="bg-white px-9 py-14 shadow rounded">
        <h3 className="text-3xl font-bold">Sorry, restaurant not found.</h3>
        <p className="text-reg font-bold">An error occurred.</p>
        <p className="mt-6 text-sm font-light">404</p>
      </div>
    </div>
  );
}

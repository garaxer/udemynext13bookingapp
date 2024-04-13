"use client";
import useReservation from "@/app/hooks/useReservation";
import { CircularProgress } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

export default function Form({
  slug,
  date,
  partySize,
}: {
  slug: string;
  date: string;
  partySize: string;
}) {
  const [day, time] = date.split("T");
  const [inputs, setInputs] = useState({
    bookerFirstName: "",
    bookerLastName: "",
    bookerPhone: "",
    bookerEmail: "",
    bookerOccasion: "",
    bookerRequest: "",
  });

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const [disabled, setDisabled] = useState(false);

  const [didBook, setDidBook] = useState(false);
  const { error, loading, createReservation } = useReservation();

  console.log({ didBook });
  const handleClick = async () => {
    const booking = await createReservation({
      bookerFirstName: inputs.bookerFirstName,
      bookerLastName: inputs.bookerLastName,
      bookerPhone: inputs.bookerPhone,
      bookerEmail: inputs.bookerEmail,
      bookerOccasion: inputs.bookerOccasion,
      bookerRequest: inputs.bookerRequest,
      slug,
      partySize,
      time,
      day,
      setDidBook,
    });
  };

  useEffect(() => {
    if (
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerPhone &&
      inputs.bookerEmail
    ) {
      return setDisabled(false);
    }
    return setDisabled(true);
  }, [inputs]);

  return didBook ? (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      <div>
        <h1> You are all booked up</h1>
        <p>Enjoy your reservation</p>
      </div>
    </div>
  ) : (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="First name"
        name="bookerFirstName"
        value={inputs.bookerFirstName}
        onChange={handleChangeInput}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Last name"
        value={inputs.bookerLastName}
        name="bookerLastName"
        onChange={handleChangeInput}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Phone number"
        value={inputs.bookerPhone}
        name="bookerPhone"
        onChange={handleChangeInput}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Email"
        value={inputs.bookerEmail}
        name="bookerEmail"
        onChange={handleChangeInput}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Occasion (optional)"
        value={inputs.bookerOccasion}
        name="bookerOccasion"
        onChange={handleChangeInput}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Requests (optional)"
        value={inputs.bookerRequest}
        name="bookerRequest"
        onChange={handleChangeInput}
      />
      <button
        disabled={disabled || loading}
        className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
        onClick={handleClick}
      >
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          "Complete reservation"
        )}
      </button>
      <p className="mt-4 text-sm">
        By clicking “Complete reservation” you agree to the OpenTable Terms of
        Use and Privacy Policy. Standard text message rates may apply. You may
        opt out of receiving text messages at any time.
      </p>
    </div>
  );
}

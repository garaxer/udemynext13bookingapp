"use client";

import useAvailabilities from "@/app/hooks/useAvailabilities";
import { partySize as partySizes, times } from "@/data";
import { Time, convertToDisplayTime } from "@/utils/convertToDisplayTime";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const { loading, data, error, fetchAvailabilities } = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>(openTime);
  const [partySize, setPartySize] = useState<string>("2");
  const [day, setDay] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const handleChangeDate = (date: Date) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const handleClick = () => {
    fetchAvailabilities({
      slug: slug,
      day,
      time,
      partySize,
    });
  };
  const filterTimeByRestaurantOpenWindow = () => {
    // openTime ex: 14:30:00.000Z
    // closeTime ex: 21:30:00.000Z
    const timesInWindow: typeof times = [];

    let isWithinWindow = false;

    times.forEach((time) => {
      if (time.time >= openTime) {
        isWithinWindow = true;
      }
      if (isWithinWindow) {
        timesInWindow.push(time);
      }
      if (time.time >= closeTime) {
        isWithinWindow = false;
      }
    });

    return timesInWindow;
  };
  return (
    <div className="lg:fixed lg:w-[15%] min-w-[250px] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation {time}</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        >
          {partySizes.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="py-3 border-b font-light text-reg w-24"
            dateFormat="dd MMM"
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {filterTimeByRestaurantOpenWindow().map((time) => (
              <option value={time.time} key={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          disabled={!slug || loading}
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={() => handleClick()}
        >
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((t) =>
              t.time ? (
                <Link
                  href={`/reserve/${slug}?date=${day}T${t.time}&partySize=${partySize}`}
                  key={t.time}
                  className="bg-red-600 cursor-pointer p-2 text-center text-white mb-3 rounded mr-3"
                >
                  <div className="text-sm font-bold">
                    {convertToDisplayTime(t.time as Time)}
                  </div>
                </Link>
              ) : (
                <p
                  key={t.time}
                  className="bg-gray-300 p-2 w-24 text-white mb-3 mr-3"
                >
                  {convertToDisplayTime(t.time as Time)}
                </p>
              )
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

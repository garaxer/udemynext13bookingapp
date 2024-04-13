import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    bookerFirstName,
    bookerLastName,
    bookerPhone,
    bookerEmail,
    bookerOccasion,
    bookerRequest,
    setDidBook,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOccasion: string;
    bookerRequest: string;
    setDidBook: Dispatch<SetStateAction<boolean>>;
  }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8069/api/restaurant/${slug}/reserve`,
        {
          bookerFirstName,
          bookerLastName,
          bookerPhone,
          bookerEmail,
          bookerOccasion,
          bookerRequest,
        },
        {
          params: {
            day,
            partySize,
            time,
          },
        }
      );
      setLoading(false);
      setDidBook(true);
      return response.data;
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return {
    loading,
    error,
    createReservation,
  };
};

export default useReservation;

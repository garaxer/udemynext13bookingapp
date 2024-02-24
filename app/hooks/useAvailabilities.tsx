import { useState } from "react";
import axios from "axios";

type Availability = {
  time: string;
  available: true;
};
const useAvailabilities = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState<null | Availability[]>();

  const fetchAvailabilities = async ({
    slug,
    partySize,
    day,
    time,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
  }) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8069/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            partySize,
            time,
          },
        }
      );
      setLoading(false);
      setData(response.data.availabilities);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return {
    loading,
    data,
    error,
    fetchAvailabilities,
  };
};

export default useAvailabilities;

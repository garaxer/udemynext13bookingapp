import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
  const { data, error, loading, setAuthState } = useAuthContext();
  const signin = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const response = await axios.post(
        `http://localhost:${process.env.port || 8069}/api/auth/signin`,
        {
          email,
          password,
        }
      );

      if (response?.data?.errorMessage) {
        throw new Error(response?.data?.errorMessage);
      }
      setAuthState({
        loading: false,
        data: data,
        error: null,
      });
      handleClose();
    } catch (error: any) {
      console.error(error);
      setAuthState({
        loading: false,
        data: null,
        error:
          typeof error?.message === "string"
            ? error?.message
            : error?.response?.data?.errorMessage,
      });
    }
  };
  const signup = () => {};

  return {
    signin,
    signup,
  };
};

export default useAuth;

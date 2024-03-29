import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { deleteCookie } from "cookies-next";

const useAuth = () => {
  const { setAuthState } = useAuthContext();
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
        data: response?.data,
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
  const signup = async (
    {
      firstName,
      lastName,
      email,
      phone,
      city,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      city: string;
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
        `http://localhost:${process.env.port || 8069}/api/auth/signup`,
        {
          firstName,
          lastName,
          email,
          phone,
          city,
          password,
        }
      );

      if (response?.data?.errorMessage) {
        throw new Error(response?.data?.errorMessage);
      }
      setAuthState({
        loading: false,
        data: response?.data,
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

  const signout = async () => {
    deleteCookie("jwt");

    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };

  return {
    signin,
    signup,
    signout,
  };
};

export default useAuth;

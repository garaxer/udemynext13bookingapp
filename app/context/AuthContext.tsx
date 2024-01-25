"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { getCookie } from "cookies-next";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface State {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: Dispatch<SetStateAction<State>>;
}

const initialState: AuthState = {
  loading: false,
  data: null,
  error: null,
  setAuthState: function (_value: SetStateAction<State>): void {},
};

const AuthenticationContext = createContext(initialState);

export const useAuthContext = () => {
  const context = useContext(AuthenticationContext);
  return context;
};

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<State>({
    loading: false,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const jwt = getCookie("jwt");
      if (!jwt) {
        return setAuthState({
          loading: false,
          data: null,
          error: null,
        });
      }

      const response = await axios.get(
        `http://localhost:${process.env.port || 8069}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;

      return setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (error: any) {
      return setAuthState({
        loading: false,
        data: null,
        error:
          typeof error?.message === "string"
            ? error?.message
            : error?.response?.data?.errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthContext;

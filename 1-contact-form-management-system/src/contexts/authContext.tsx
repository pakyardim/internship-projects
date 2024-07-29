/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";

import { useSnackbar } from "src/contexts";
import { UserType } from "src/types";

interface AuthContextType {
  functions: {
    login: (data: {
      username: string;
      password: string;
    }) => Promise<boolean | void>;
    logout: () => Promise<boolean | void>;
    autoLogin: () => Promise<string | null>;
  };
  values: {
    user: UserType;
    loading: boolean;
    errorMessage: string;
  };
  setters: {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setUser: React.Dispatch<React.SetStateAction<UserType>>;
  };
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("The component must be wrapped by the auth provider!");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(null!);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { showSnackbar } = useSnackbar();

  const injectToken = (token: string) => {
    axios.defaults.headers.token = token;
  };

  const login = useCallback(
    async (data: { username: string; password: string }) => {
      setLoading(true);
      try {
        const response = await axios.post("/user/login", data);

        if (response?.data?.data?.token) {
          const token = response.data.data.token;
          const user = response.data.data.user;
          localStorage.setItem("token", token);
          setUser(user);
          injectToken(token);
          setLoading(false);
          return true;
        } else {
          showSnackbar(
            response?.data.data.message || "Something went wrong!",
            "error"
          );
        }
      } catch (err: any) {
        showSnackbar(
          err.response?.data?.error || err.message || "Something went wrong!",
          "error"
        );
      }
      setLoading(false);
    },
    [showSnackbar]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post("/user/logout");
      setUser({} as UserType);
      axios.defaults.headers.token = "";
      localStorage.removeItem("token");
      setLoading(false);
      return true;
    } catch (err: any) {
      showSnackbar(
        err.response?.data?.error || err.message || "Something went wrong!",
        "error"
      );
      setLoading(false);
    }
  }, []);

  const autoLogin = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (token) {
      injectToken(token);

      try {
        const response = await axios.post("/user/check-login");
        const user = response?.data.data.user;

        if (!user) {
          logout();
        } else {
          setUser(user);
        }
      } catch (err) {
        logout();
      }
    }
    return token;
  }, []);

  const value = useMemo(() => {
    const functions = {
      login,
      logout,
      autoLogin,
    };
    const values = {
      user,
      loading,
      errorMessage,
    };
    const setters = {
      setErrorMessage,
      setUser,
    };
    return {
      functions,
      values,
      setters,
    };
  }, [login, logout, autoLogin, user, loading, errorMessage]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

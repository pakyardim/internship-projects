import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { useSnackbar } from "src/contexts/snackbarContext";

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  base64Photo: string;
} | null;

interface AuthContextType {
  functions: {
    login: (data: {
      username: string;
      password: string;
    }) => Promise<boolean | void>;
    logout: () => void;
  };
  values: {
    user: User;
    token: string;
    loading: boolean;
    errorMessage: string;
  };
  setters: {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setUser: React.Dispatch<React.SetStateAction<User>>;
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
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { showSnackbar } = useSnackbar();

  // const injectToken = (token: string) => {
  //   axios.defaults.headers.token = token;
  // };

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
          setToken(token);
          // injectToken(token);
          setLoading(false);
          return true;
        } else {
          showSnackbar(
            response?.data.data.message || "Something went wrong!",
            "error"
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    setUser(null);
    setToken("");
    // axios.defaults.headers.token = "";
    localStorage.removeItem("token");
  }, []);

  const value = useMemo(() => {
    const functions = {
      login,
      logout,
    };
    const values = {
      user,
      token,
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
  }, [login, logout, token, user, loading, errorMessage]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

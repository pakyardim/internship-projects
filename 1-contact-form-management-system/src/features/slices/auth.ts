import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { UserType } from "src/types";
import { getTokenFromCookies } from "src/utils";

const Statuses = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAIL: "fail",
} as const;

type StatusType = (typeof Statuses)[keyof typeof Statuses];

interface AuthState {
  isAuthenticated: boolean;
  user: UserType | null;
  errorMessage: string | null;
  status: StatusType;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: Statuses.IDLE,
  errorMessage: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { username: string; password: string }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
      credentials
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const token = getTokenFromCookies();
  if (!token) {
    throw new Error("No token found");
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.request({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`,
    method: "POST",
    headers,
  });

  return response.data;
});

export const checkLoginStatus = createAsyncThunk(
  "auth/checkLoginStatus",
  async () => {
    const token = getTokenFromCookies();
    if (!token) {
      throw new Error("No token found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/check-login`,
      config
    );

    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.errorMessage = null;
      document.cookie =
        "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state: any) => {
        state.status = Statuses.LOADING;
      })
      .addCase(loginUser.fulfilled, (state: any, action) => {
        state.isAuthenticated = true;
        const { token, user } = action.payload;
        state.user = user;
        state.errorMessage = null;
        document.cookie = `auth-token=${token}; path=/;`;
        state.status = Statuses.SUCCEEDED;
      })
      .addCase(loginUser.rejected, (state: any, action) => {
        state.status = Statuses.FAIL;
        state.errorMessage = action.error.message || "Login failed";
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = Statuses.LOADING;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.errorMessage = null;
        document.cookie =
          "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
        state.status = Statuses.SUCCEEDED;
      })
      .addCase(logoutUser.rejected, (state: any, action) => {
        state.status = Statuses.FAIL;
        state.errorMessage = action.error.message || "Logout failed";
      })
      .addCase(checkLoginStatus.pending, (state, action) => {
        state.status = Statuses.LOADING;
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.status = Statuses.SUCCEEDED;
      })
      .addCase(checkLoginStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = Statuses.FAIL;
      });
  },
});

export default authSlice.reducer;

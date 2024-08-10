import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { UserType } from "src/types";
import { getTokenFromCookies } from "src/utils";

interface AuthState {
  isAuthenticated: boolean;
  user: UserType | null;
  errorMessage: string | null;
  status: "idle" | "loading" | "succeeded" | "fail";
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
  errorMessage: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { username: string; password: string }) => {
    const response = await axios.post(
      "http://localhost:5166/api/users/login",
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
    url: "http://localhost:5166/api/users/logout",
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
      "http://localhost:5166/api/users/check-login",
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
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state: any, action) => {
        state.isAuthenticated = true;
        const { token, user } = action.payload;
        state.user = user;
        state.errorMessage = null;
        document.cookie = `auth-token=${token}; path=/;`;
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state: any, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message || "Login failed";
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.errorMessage = null;
        document.cookie =
          "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
        state.status = "succeeded";
      })
      .addCase(logoutUser.rejected, (state: any, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message || "Logout failed";
      })
      .addCase(checkLoginStatus.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.status = "succeeded";
      })
      .addCase(checkLoginStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;

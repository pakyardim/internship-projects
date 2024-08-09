import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { UserType } from "src/types";

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
        state.user = action.payload;
        state.status = "succeeded";
        state.errorMessage = null;
        const { token } = action.payload;
        document.cookie = `auth-token=${token}; path=/;`;
      })
      .addCase(loginUser.rejected, (state: any, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

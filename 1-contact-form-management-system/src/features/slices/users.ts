import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokenFromCookies } from "src/utils";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5166/api",
  prepareHeaders: (headers) => {
    const token = getTokenFromCookies();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const usersAPI = createApi({
  reducerPath: "usersAPI",
  baseQuery,
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "users",
    }),
  }),
});

export const { useGetAllUsersQuery } = usersAPI;

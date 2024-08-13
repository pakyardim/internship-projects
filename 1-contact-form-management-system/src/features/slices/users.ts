import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserType } from "src/types";

import { getTokenFromCookies } from "src/utils";

export const usersAPI = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5166/api",
    prepareHeaders: (headers) => {
      const token = getTokenFromCookies();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({ url: "users", providesTags: ["AllUsers"] }),
    }),
    getUserById: builder.query({
      query: (id: string) => `users/by-id/${id}`,
    }),
    addReader: builder.mutation({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
    }),
    editReader: builder.mutation({
      query: (user) => ({
        url: `users/by-id/${user.id}`,
        method: "PUT",
        body: user,
        invalidateTags: ["AllUsers"],
      }),
      onQueryStarted: async (user, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          usersAPI.util.updateQueryData("getAllUsers", undefined, (draft) => {
            const index = draft.findIndex(
              (existingUser: UserType) => existingUser.id === user.id
            );
            if (index !== -1) {
              draft[index] = { ...draft[index], ...user };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useAddReaderMutation,
  useEditReaderMutation,
} = usersAPI;

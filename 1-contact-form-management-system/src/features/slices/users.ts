import { baseApi } from "./baseApi";

export const usersAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({ url: "users", providesTags: () => ["AllUsers"] }),
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
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useAddReaderMutation,
  useEditReaderMutation,
} = usersAPI;

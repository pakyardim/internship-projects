import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageType } from "src/types";
import { getTokenFromCookies } from "src/utils";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5166/api",
  prepareHeaders: (headers, { endpoint }) => {
    if (endpoint !== "addMessage") {
      const token = getTokenFromCookies();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

export const messagesAPI = createApi({
  reducerPath: "messagesAPI",
  baseQuery,
  endpoints: (builder) => ({
    addMessage: builder.mutation({
      query: (body) => ({
        url: "messages",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: MessageType }, meta, arg) =>
        response.data,
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => response.status,
    }),
    readMessage: builder.mutation({
      query: (id) => ({
        url: `messages/${id}`,
        method: "PUT",
      }),
    }),
    getUnreadMessages: builder.query({
      query: () => "messages/unread",
    }),
    getReports: builder.query({
      query: () => "messages/get-reports",
    }),
  }),
});

export const {
  useAddMessageMutation,
  useReadMessageMutation,
  useGetUnreadMessagesQuery,
  useGetReportsQuery,
} = messagesAPI;

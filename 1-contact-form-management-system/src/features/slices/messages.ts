import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageType } from "src/types";

export const messagesAPI = createApi({
  reducerPath: "messagesAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5166/api" }),
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
  }),
});

export const { useAddMessageMutation } = messagesAPI;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { MessageType } from "src/types";
import { getTokenFromCookies } from "src/utils";

export const messagesAPI = createApi({
  reducerPath: "messagesAPI",
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
  tagTypes: ["AllMessages", "AllMessagesScroll", "Reports"],
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
    getUnreadMessages: builder.query({
      query: () => "messages/unread",
    }),
    getMessage: builder.query({
      query: (id: number) => `messages/${id}`,
    }),
    getAllMessages: builder.query({
      query: ({ page, limit, sort }) => ({
        url: `messages?page=${page}&limit=${limit}&sort=${sort}`,
        providesTags: () => ["AllMessages"],
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg.page !== previousArg?.page,
    }),
    getAllMessagesScroll: builder.query({
      query: ({ page, limit, sort }) => ({
        url: `messages?page=${page}&limit=${limit}&sort=${sort}`,
        providesTags: () => ["AllMessagesScroll"],
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        if (!currentCache) return newItems;
        return {
          messages: [...currentCache.messages, ...newItems.messages],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg.page !== previousArg?.page,
    }),
    getReports: builder.query({
      query: () => ({
        url: "messages/get-reports",
        providesTags: () => ["Reports"],
      }),
    }),
    readMessage: builder.mutation({
      query: (id) => ({
        url: `messages/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["AllMessages", "AllMessagesScroll"],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllMessages", "AllMessagesScroll"],
    }),
  }),
});

export const readMessageUpdate = (id: number) =>
  messagesAPI.util.updateQueryData("getAllMessages", undefined, (draft) => {
    const messageToUpdateIdx = draft?.messages?.findIndex(
      (msg: MessageType) => msg.id === id
    );

    if (messageToUpdateIdx === -1) return draft;

    draft.messages[messageToUpdateIdx].read = 1;

    return draft;
  });

export const {
  useAddMessageMutation,
  useReadMessageMutation,
  useGetMessageQuery,
  useGetUnreadMessagesQuery,
  useGetAllMessagesQuery,
  useGetAllMessagesScrollQuery,
  useGetReportsQuery,
  useDeleteMessageMutation,
} = messagesAPI;

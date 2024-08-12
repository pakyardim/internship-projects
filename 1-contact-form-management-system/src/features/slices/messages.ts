import { MessageType } from "src/types";
import { baseApi } from "./baseApi";

export const messagesAPI = baseApi.injectEndpoints({
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
      invalidatesTags: ["AllMessages"],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllMessages"],
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
  useGetReportsQuery,
  useDeleteMessageMutation,
} = messagesAPI;

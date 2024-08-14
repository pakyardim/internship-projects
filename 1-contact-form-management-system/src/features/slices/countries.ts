import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const countriesAPI = createApi({
  reducerPath: "countriesAPI",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  endpoints: (builder) => ({
    getAllCountries: builder.query({
      query: () => "countries",
    }),
  }),
});

export const { useGetAllCountriesQuery } = countriesAPI;

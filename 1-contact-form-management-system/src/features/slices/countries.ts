import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const countriesAPI = createApi({
  reducerPath: "countriesAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5166/api" }),
  endpoints: (builder) => ({
    getAllCountries: builder.query({
      query: () => "countries",
    }),
  }),
});

export const { useGetAllCountriesQuery } = countriesAPI;

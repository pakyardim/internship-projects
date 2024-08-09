import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { countriesAPI, messagesAPI } from "./slices";

export const store = configureStore({
  reducer: {
    [countriesAPI.reducerPath]: countriesAPI.reducer,
    [messagesAPI.reducerPath]: messagesAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      countriesAPI.middleware,
      messagesAPI.middleware
    ),
});
setupListeners(store.dispatch);

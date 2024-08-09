import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { countriesAPI, messagesAPI } from "./slices";
import authReducer from "./slices/auth";

export const store = configureStore({
  reducer: {
    [countriesAPI.reducerPath]: countriesAPI.reducer,
    [messagesAPI.reducerPath]: messagesAPI.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      countriesAPI.middleware,
      messagesAPI.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

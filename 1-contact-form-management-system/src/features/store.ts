import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { countriesAPI, messagesAPI, usersAPI } from "./slices";
import authReducer from "./slices/auth";

export const store = configureStore({
  reducer: {
    [countriesAPI.reducerPath]: countriesAPI.reducer,
    [messagesAPI.reducerPath]: messagesAPI.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      countriesAPI.middleware,
      messagesAPI.middleware,
      usersAPI.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

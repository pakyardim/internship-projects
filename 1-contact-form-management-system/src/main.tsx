import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "./App.tsx";
import "./index.scss";
import "./i18n.ts";
import { SnackbarProvider } from "src/contexts/SnackbarContext.tsx";

axios.defaults.baseURL = "http://localhost:5165/api";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

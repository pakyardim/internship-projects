import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import axios from "axios";

import { SnackbarProvider } from "src/contexts/snackbarContext.tsx";
import { AuthProvider } from "src/contexts/authContext.tsx";
import App from "./App.tsx";
import "./index.scss";
import "./i18n.ts";

axios.defaults.baseURL = "http://localhost:5165/api";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <SnackbarProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import "./i18n.ts";
import { SnackbarProvider } from "src/contexts/SnackbarContext.tsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
  </React.StrictMode>
);

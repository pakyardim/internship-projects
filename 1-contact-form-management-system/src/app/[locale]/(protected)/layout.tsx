"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { checkLoginStatus } from "src/features/slices/auth";
import { AppDispatch } from "src/features/store";
import { Footer, ProtectedHeader } from "src/components/layouts";
import { useSnackbar } from "src/contexts/snackbarContext";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch: AppDispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5166");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_MESSAGE") {
        showSnackbar(
          `${data.content.name}: ${data.content.message}`,
          "success"
        );
      }
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [showSnackbar]);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  return (
    <div className="xl:container mx-auto flex flex-col min-h-screen">
      <ProtectedHeader />
      {children}
      <Footer />
    </div>
  );
}

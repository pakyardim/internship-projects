"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { checkLoginStatus } from "src/features/slices/auth";
import { AppDispatch } from "src/features/store";
import { Footer, ProtectedHeader } from "src/components/layouts";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch: AppDispatch = useDispatch();

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

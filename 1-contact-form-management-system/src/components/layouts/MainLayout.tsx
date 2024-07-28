import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuthContext } from "src/contexts/authContext";
import { ProtectedHeader } from "./ProtectedHeader";

interface Props {
  children?: ReactNode;
}

export function MainLayout({ children }: Props) {
  const {
    values: { user },
  } = useAuthContext();

  const isAuthenticated = localStorage.getItem("token");

  return (
    <div className="xl:container mx-auto flex flex-col min-h-screen">
      {isAuthenticated ? <ProtectedHeader /> : <Header />}
      {children || <Outlet />}
      <Footer />
    </div>
  );
}

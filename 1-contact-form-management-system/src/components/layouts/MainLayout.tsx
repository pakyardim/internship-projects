import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { useAuthContext } from "src/contexts";
import { Header, ProtectedHeader, Footer } from "src/components/layouts";

interface Props {
  children?: ReactNode;
}

export function MainLayout({ children }: Props) {
  const {
    values: { user },
  } = useAuthContext();

  const isAuthenticated = user && localStorage.getItem("token");

  return (
    <div className="xl:container mx-auto flex flex-col min-h-screen">
      {isAuthenticated ? <ProtectedHeader /> : <Header />}
      {children || <Outlet />}
      <Footer />
    </div>
  );
}

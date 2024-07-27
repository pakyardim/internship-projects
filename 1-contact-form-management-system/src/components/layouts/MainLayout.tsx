import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  children?: ReactNode;
}

export function MainLayout({ children }: Props) {
  return (
    <div className="xl:container mx-auto flex flex-col min-h-screen">
      <Header />
      {children || <Outlet />}
      <Footer />
    </div>
  );
}

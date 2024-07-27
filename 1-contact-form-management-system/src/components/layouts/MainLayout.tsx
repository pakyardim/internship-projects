import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="lg:container mx-auto flex flex-col min-h-screen">
      <Header />
      {children || <Outlet />}
      <Footer />
    </div>
  );
};

export default MainLayout;

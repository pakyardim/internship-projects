import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { ProtectedHeader } from "./ProtectedHeader";
import { Footer } from "./Footer";

interface Props {
  children?: ReactNode;
}

export function ProtectedLayout({ children }: Props) {
  return (
    <div className="xl:container mx-auto flex flex-col min-h-screen">
      <ProtectedHeader />
      {children || <Outlet />}
      <Footer />
    </div>
  );
}

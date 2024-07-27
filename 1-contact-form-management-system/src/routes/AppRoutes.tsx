import type { ReactNode } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import { Contact } from "src/pages/Contact";
import { NotFound } from "src/pages/NotFound";
import { NotAuthorized } from "src/pages/NotAuthorized";
import MainLayout from "src/components/layouts/MainLayout";

interface Props {
  children: ReactNode;
}

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }: Props) => {
  return isAuthenticated() ? children : <Navigate to="/not-authorized" />;
};

const GuestRoute = ({ children }: Props) => {
  return isAuthenticated() ? <Navigate to="/home" /> : children;
};

export function AppRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <GuestRoute>
              <Contact />
            </GuestRoute>
          ),
        },
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "/not-authorized",
          element: <NotAuthorized />,
        },
      ],
    },
  ]);
}

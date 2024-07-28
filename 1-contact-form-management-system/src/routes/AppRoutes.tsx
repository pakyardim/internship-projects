import type { ReactNode } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import { MainLayout } from "src/components/layouts/MainLayout";
import { ProtectedLayout } from "src/components/layouts/ProtectedLayout";

import { Contact } from "src/pages/Contact";
import { NotFound } from "src/pages/NotFound";
import { NotAuthorized } from "src/pages/NotAuthorized";
import { Login } from "src/pages/Login";
import { Messages } from "src/pages/Messages";
import { MessageDetail } from "src/pages/MessageDetail";

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
  return isAuthenticated() ? <Navigate to="/dashboard" /> : children;
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
    {
      path: "/login",
      element: (
        <GuestRoute>
          <Login />
        </GuestRoute>
      ),
    },
    {
      path: "/",
      element: <ProtectedLayout />,
      children: [
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          ),
        },
        {
          path: "/messages",
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          ),
        },
        {
          path: "/messages/:id",
          element: (
            <ProtectedRoute>
              <MessageDetail />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
}

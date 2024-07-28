import type { ReactNode } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import { MainLayout } from "src/components/layouts/MainLayout";

import { Contact } from "src/pages/Contact";
import { NotFound } from "src/pages/NotFound";
import { NotAuthorized } from "src/pages/NotAuthorized";
import { Login } from "src/pages/Login";
import { Messages } from "src/pages/Messages";
import { Users } from "src/pages/Users";
import { MessageDetail } from "src/pages/MessageDetail";
import { AddEditUser } from "src/pages/AddEditUser";

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
          path: "not-authorized",
          element: <NotAuthorized />,
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          ),
        },
        {
          path: "messages",
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          ),
        },
        {
          path: "messages/:id",
          element: (
            <ProtectedRoute>
              <MessageDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "users",
          element: (
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          ),
        },
        {
          path: "users/add-user",
          element: (
            <ProtectedRoute>
              <AddEditUser isEdit={false} />
            </ProtectedRoute>
          ),
        },
        {
          path: "users/edit-user",
          element: <Navigate to="/users" />,
        },
        {
          path: "users/edit-user/:id",
          element: (
            <ProtectedRoute>
              <AddEditUser isEdit={true} />
            </ProtectedRoute>
          ),
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
  ]);
}

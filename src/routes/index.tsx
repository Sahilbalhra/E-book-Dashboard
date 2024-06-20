import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/login";
import Home from "@/pages/home";
import SignUp from "@/pages/signup";
import DashboardLayout from "@/layout/DashboardLayout";
import Books from "@/pages/books";
import AuthLayout from "@/layout/AuthLayout";

const router = createBrowserRouter([
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "books",
        element: <Books />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
]);

export default router;

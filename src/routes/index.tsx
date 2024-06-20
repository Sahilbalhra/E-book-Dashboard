import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/login";
import Home from "@/pages/home";
import SignUp from "@/pages/signup";
import DashboardLayout from "@/layout/DashboardLayout";
import Books from "@/pages/books";

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
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

export default router;

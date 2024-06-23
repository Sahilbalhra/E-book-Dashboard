import { Outlet, Navigate } from "react-router-dom";
import { useLoggedInUserStore } from "@/store/store";

const AuthLayout = () => {
  const loggedInUser = useLoggedInUserStore((state) => state.loggedInData);

  if (loggedInUser?.user) {
    return <Navigate to="/dashboard/home" replace />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;

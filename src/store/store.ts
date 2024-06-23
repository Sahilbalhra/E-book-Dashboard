import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UserLoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoggedInUserStore {
  loggedInData: UserLoginData | null;
  setLoggedInData: (data: UserLoginData | null) => void;
}

export const useLoggedInUserStore = create<LoggedInUserStore>()(
  devtools(
    persist(
      (set) => ({
        loggedInData: null,
        setLoggedInData: (data: UserLoginData | null) =>
          set({ loggedInData: data }),
      }),
      {
        name: "loggedInUser",
      }
    )
  )
);

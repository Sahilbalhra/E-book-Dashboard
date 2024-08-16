import { useLoggedInUserStore } from "@/store/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useLoggedInUserStore.getState().loggedInData?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = async (data: { email: string; password: string }) => {
  return api.post("/api/users/login", data);
};

export const signupApi = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  return api.post("/api/users/register", data);
};

export const getBooksApi = async () => {
  return api.get("/api/books");
};

export const createBookApi = async (data: FormData) =>
  api.post("/api/books/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateBookApi = async (data: FormData) =>
  api.patch("/api/books/update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getBookByIdApi = async (data: string) => {
  if (!data) {
    throw new Error("ID is required");
  }
  return api.get(`/api/books/${data}`);
};

export const getReviewsByBookIdApi = async (bookId: string | null) => {
  if (!bookId) {
    throw new Error("Book ID is required");
  }
  return api.get(`/api/review/${bookId}`);
};

export const deleteReviewApi = async (reviewId: string) => {
  if (!reviewId) {
    throw new Error("Review ID is required");
  }
  return api.delete(`/api/review/${reviewId}`);
};

export const deleteBookApi = async (data: string) =>
  api.delete(`/api/books/${data}`);

export const getDashboardData = async () => {
  return api.get("/api/dashboard");
};

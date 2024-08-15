export interface User {
  _id: string;
  name: string;
  email?: string;
}
export interface TopUser {
  user_id: string;
  name: string;
  email: string;
  reviewCount: number;
}

export interface Book {
  _id: string;
  title: string;
  description: string;
  author: User;
  genre: string;
  cover_image: string;
  file: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user_id: User;
  book_id: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  rating: number;
  count: number;
}

export interface ReviewsApi {
  totalRatings: number;
  averageRating: number;
  reviews: Review[];
  ratings: Rating[];
}

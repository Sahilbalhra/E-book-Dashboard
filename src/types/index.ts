export interface User {
  _id: string;
  name: string;
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

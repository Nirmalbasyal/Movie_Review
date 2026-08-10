export type Role = "admin" | "user";

export type User = {
  id: string;
  userName: string;
  role: Role;
};

export type Movie = {
  _id: string;
  name: string;
  description: string;
  genre: string;
  thumbnail: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
};

export type Review = {
  _id: string;
  rating: number;
  comment: string;
  user: { _id: string; userName: string };
  createdAt: string;
};

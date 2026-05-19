export type Book = {
  id?: string;

  title: string;
  author: string;
  publisher: string;

  purchaseDate?: string;

  stamped: boolean;

  status: "At Home" | "Lent";

  lentTo?: string;

  notes?: string;

  createdAt: number;
};
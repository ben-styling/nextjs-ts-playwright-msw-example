import { Book } from "src/pages";

export const getBook = async () => {
  const res = await fetch(`${process.env.API_URL}/b/AFRW`, {
    headers: {
      Authorization: `Bearer test`,
    },
  });
  const book = (await res.json()) as Book;
  return book;
};

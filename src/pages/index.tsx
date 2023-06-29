import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useState } from "react";
import { getBook } from "src/server/getBook";

export type Book = {
  imageUrl: string;
  title: string;
  description: string;
};
type Review = {
  id: string;
  text: string;
  author: string;
};

export default function Home({
  book,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [reviews, setReviews] = useState<null | Review[]>(null);

  const handleGetReviews = () => {
    fetch("/testing/api/reviews")
      .then((res) => res.json())
      .then(setReviews);
  };

  return (
    <div>
      <img src={book.imageUrl} alt={book.title} width="250" />
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <button onClick={handleGetReviews}>Load reviews</button>
      {reviews && (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p>{review.text}</p>
              <p>{review.author}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{ book: Book }> = async ({
  req,
}) => {
  const book = await getBook();
  if (!book)
    return {
      redirect: {
        destination: "/404",
        statusCode: 301,
      },
    };
  return {
    props: {
      book,
    },
  };
};

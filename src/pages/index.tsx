import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { getBook } from "src/server/getBook";
import { redirect, typeSafeSSP } from "src/server/typesafeServerSideProps";

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
}: InferGetServerSidePropsType<typeof myServerSideProps>) {
  const [reviews, setReviews] = useState<null | Review[]>(null);

  const handleGetReviews = () => {
    fetch("/api/reviews")
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

const myServerSideProps = async () => {
  const book = await getBook();
  if (!book) return redirect("/404");
  return {
    props: {
      book,
    },
  };
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  await typeSafeSSP(ctx)(myServerSideProps);

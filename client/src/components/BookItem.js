import React from "react";

export default function BookItem({
  book: { title, author, pageCount, userRating, ratingAllUser, ratingCount }
}) {
  return (
    <div className="book">
      <span className="title">{title}</span> by {author}
    </div>
  );
}

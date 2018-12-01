import React, { Component, Fragment } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import BookItem from "./BookItem";

const BOOKS_QUERY = gql`
  query BooksQuery {
    books(id: 89901274) {
      userBooks {
        title
        author
        pageCount
        ratingUser
        pageCount
        ratingAllUsers
        ratingCount
      }
    }
  }
`;

class Books extends React.Component {
  render() {
    return (
      <Fragment>
        <h1>Books</h1>
        <Query query={BOOKS_QUERY} userId="89901274">
          {({ loading, error, data }) => {
            if (loading) return <h4>Loading...</h4>;
            if (error) console.log(error);
            console.log(data);

            return (
              <Fragment>
                {" "}
                {data.books.userBooks.map(book => (
                  <BookItem key={book.title} book={book} />
                ))}
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default Books;

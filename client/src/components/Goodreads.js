import React, { Fragment } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import BookItem from "./BookItem";
import BooksViz from "./BooksViz";

const BOOKS_QUERY = gql`
  query BooksQuery($id: String!) {
    books(id: $id) {
      userBooks {
        title
        author
        pageCount
        ratingUser
        pageCount
        ratingAllUsers
        ratingCount
        readDate
        publishDate
      }
    }
  }
`;

const BookList = ({ id }) => (
  <Query query={BOOKS_QUERY} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return <h4>Loading...</h4>;
      if (error) return <h1>Please enter a valid Goodreads UserId</h1>;
      return (
        <Fragment>
          {data.books.userBooks.map(book => (
            <BookItem key={book.title} book={book} />
          ))}
        </Fragment>
      );
    }}
  </Query>
);

function UserBooks(props) {
  const hasUserId = props.userId;
  if (hasUserId.toString().length === 8) {
    return (
      <div className="wrapper">
        <BookList id={hasUserId} />
        <BooksViz id={hasUserId} />
      </div>
    );
  }
  return <h1>Please enter a valid Goodreads UserId</h1>;
}

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      queryValue: "",
      inputValue: ""
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.value.length > 0) {
      this.setState({ inputValue: event.target.value });
    } else {
      this.setState({ inputValue: "" });
    }
  }

  render() {
    return (
      <Fragment>
        <form>
          <label>
            User ID or Username:
            <input
              type="text"
              value={this.state.inputValue}
              onChange={this.handleChange}
            />
          </label>
        </form>
        <h2>User Books</h2>
        <aside className="bookPanel">
          <UserBooks userId={this.state.inputValue} />
        </aside>
      </Fragment>
    );
  }
}

export default User;

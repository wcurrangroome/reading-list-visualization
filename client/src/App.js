import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import "./App.css";
import User from "./components/Goodreads";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="container">
          <h1>Goodreads</h1>
        </div>
        <User />
      </ApolloProvider>
    );
  }
}

export default App;

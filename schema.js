const fetch = require("node-fetch");
const util = require("util");
const parseXML = util.promisify(require("xml2js").parseString);
const key = "tNMmiZMaeysAOmDsWtL8g";
const id = 89901274;

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require("graphql");

const BookType = new GraphQLObjectType({
  name: "Books",
  description: "User's books",
  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: xml => xml.title[0] ///xml.map(x => x.title[0]))
    },
    author: {
      type: GraphQLString,
      resolve: xml => xml.authors[0].author[0].name[0]
    },
    isbn: {
      type: GraphQLString,
      resolve: xml => xml.isbn[0]
    },
    pageCount: {
      type: GraphQLString,
      resolve: xml => xml.num_pages[0]
    },
    ratingUser: {
      type: GraphQLString,
      resolve: xml => xml.rating
    },
    ratingAllUsers: {
      type: GraphQLString,
      resolve: xml => xml.average_rating[0]
    },
    ratingCount: {
      type: GraphQLString,
      resolve: xml => xml.ratings_count[0]
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User",
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: xml => xml.GoodreadsResponse.user[0].name[0]
    },
    userBooks: {
      type: new GraphQLList(BookType),
      resolve: xml => xml.GoodreadsResponse.books[0].book
    }
  })
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    description: "A description",
    fields: () => ({
      user: {
        type: UserType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (root, args) =>
          fetch(
            `https://www.goodreads.com/user/show/${
              args.id
            }.xml?key=tNMmiZMaeysAOmDsWtL8g`
          )
            .then(res => res.text())
            .then(parseXML)
      },
      books: {
        type: UserType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (root, args) =>
          fetch(
            `https://www.goodreads.com/review/list/${
              args.id
            }.xml?key=tNMmiZMaeysAOmDsWtL8g&per_page=200`
          )
            .then(res => res.text())
            .then(parseXML)
      }
    })
  })
});

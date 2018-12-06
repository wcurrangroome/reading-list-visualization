const fetch = require("node-fetch");
const util = require("util");
const parseXML = util.promisify(require("xml2js").parseString);

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList
} = require("graphql");

const {
  GraphQLDate
  //GraphQLDateTime,
  //GraphQLTime
} = require("graphql-iso-date");

//xml.GoodreadsResponse.reviews
const BookType = new GraphQLObjectType({
  name: "Books",
  description: "User's books",
  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: xml => xml.book[0].title[0]
    },
    author: {
      type: GraphQLString,
      resolve: xml => xml.book[0].authors[0].author[0].name[0]
    },
    isbn: {
      type: GraphQLString,
      resolve: xml => xml.book[0].isbn[0]
    },
    pageCount: {
      type: GraphQLString,
      resolve: xml => xml.book[0].num_pages[0]
    },
    ratingUser: {
      type: GraphQLString,
      resolve: xml => xml.rating[0]
    },
    ratingAllUsers: {
      type: GraphQLString,
      resolve: xml => xml.book[0].average_rating[0]
    },
    ratingCount: {
      type: GraphQLString,
      resolve: xml => xml.book[0].ratings_count[0]
    },
    readDate: {
      type: GraphQLDate,
      resolve: xml => {
        const months = {
          Jan: "01",
          Feb: "02",
          Mar: "03",
          Apr: "04",
          May: "05",
          Jun: "06",
          Jul: "07",
          Aug: "08",
          Sep: "09",
          Oct: "10",
          Nov: "11",
          Dec: "12"
        };
        const dateArray = xml.read_at[0].split(" ");
        return new Date(
          dateArray[dateArray.length - 1],
          parseInt(months[dateArray[1]], 10),
          dateArray[2]
        );
      }
    },
    publishDate: {
      type: GraphQLDate,
      resolve: xml =>
        new Date(
          xml.book[0].publication_year[0],
          xml.book[0].publication_month[0],
          xml.book[0].publication_day[0]
        )
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
      resolve: xml => xml.GoodreadsResponse.reviews[0].review
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
          id: { type: GraphQLString }
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
          id: { type: GraphQLString }
        },
        resolve: (root, args) =>
          fetch(
            `https://www.goodreads.com/review/list/${
              args.id
            }.xml?key=tNMmiZMaeysAOmDsWtL8g&v=2&per_page=200`
          )
            .then(res => res.text())
            .then(parseXML)
      }
    })
  })
});

const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
const fetch = require("node-fetch");
const schema = require("./schema");
const DataLoader = require("dataloader");
const util = require("util");
const parseXML = util.promisify(require("xml2js").parseString);
const cors = require("cors");

//Allow CORS
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(4000);
console.log("Listening ...");

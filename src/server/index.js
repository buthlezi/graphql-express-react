const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
// gql tag allows code editor to realize that we are writing
// GraphQl code so it can be stylized properly - also parses
// string and converts it to Gr AST ( abstract syntax tree)
// we then need to build a schema using "bulidASTSchema"

const { buildASTSchema } = require('graphql');

// Native Node does not support !import" tag - "require"
// used instead. Create React App uses babel to
// transpile the code before running it, which allows
// the use of the "import" syntax in the React code,
// This will be seen in the frontend code

const POSTS = [
  { author: "John Doe", body: "Hello world" },
  { author: "Jane Doe", body: "Hi, planet!" },
];

//  POSTS uses mock data

const schema = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

# Query type is a special type that lets us query the data
# this code says that posts will give us an array of Posts
# if you want a single Post you can query it by calling
# post and passing in the ID

  type Post {
    id: ID
    author: String
    body: String
  }
`);

// we define a Post type, which contains an id, and author, and a body.
// we need to say what the types are for each element - here, author
// and body both use the primitive String type, and id is an ID.

const mapPost = (post, id) => post && ({ id, ...post });

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id),
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);

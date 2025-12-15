import { gql } from 'graphql-tag';

/**
 * GraphQL Schema Definition
 */
const typeDefs = gql`
  scalar Date

  type Author {
    id: Int!
    first_name: String!
    last_name: String!
    email: String
    birthdate: Date
    added: Date
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String!
    author_id: Int!
    description: String
    content: String
    date: Date
    author: Author
  }

  type Authors {
    list: [Author]!
    count: Int!
  }

  type Posts {
    list: [Post]!
    count: Int!
  }

  # Auth types
  type User {
    id: Int!
    username: String!
    email: String!
  }

  type AuthPayload {
    user: User!
    accessToken: String!
  }

  # Input types for mutations
  input CreateAuthorInput {
    first_name: String!
    last_name: String!
    email: String!
    birthdate: String!
  }

  input UpdateAuthorInput {
    first_name: String
    last_name: String
    email: String
    birthdate: String
  }

  input CreatePostInput {
    title: String!
    author_id: Int!
    description: String
    content: String
  }

  input UpdatePostInput {
    title: String
    description: String
    content: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    authors(limit: Int = 20, offset: Int = 0, id: Int): Authors
    posts(limit: Int = 20, offset: Int = 0, id: Int): Posts
  }

  type Mutation {
    # Author mutations
    createAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(id: Int!, input: UpdateAuthorInput!): Author!
    deleteAuthor(id: Int!): Boolean!

    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(id: Int!, input: UpdatePostInput!): Post!
    deletePost(id: Int!): Boolean!

    # Auth mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;

export default typeDefs;

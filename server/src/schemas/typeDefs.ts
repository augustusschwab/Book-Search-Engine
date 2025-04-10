const typeDefs = `
type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Book]!
}

input UserInput {
    username: String!
    email: String!
    password: String!
}

type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}

input BookInput {
    bookId: String!
    authors: [String]
    title: String!
    description: String!
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
}
`

export default typeDefs;
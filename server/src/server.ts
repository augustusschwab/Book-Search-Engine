import express from 'express';
import db from './config/connection.js';
import path from 'node:path';
import routes from './routes/index.js';

// Import the ApolloServer class
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'

// Import GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js'

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(routes);

  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
}






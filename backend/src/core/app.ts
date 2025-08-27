import express from 'express';
import cors from 'cors';
import { apiLimiter } from '../middleware/rateLimit';
import helmet from 'helmet';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import morgan from 'morgan';
import { readFileSync } from 'fs';
import { join } from 'path';
import { combinedResolvers, combinedTypeDefs } from '../modules';
import { authenticateJWT } from '../middleware/auth';

// Load GraphQL type definitions from multiple modules
// Use combinedTypeDefs from modules for ApolloServer
const typeDefs = combinedTypeDefs;

async function startServer() {
  const app = express();

  // Add request logging
  app.use(morgan('dev'));

  // CORS middleware
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://studio.apollographql.com']; // Add more as needed
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for Playground assets
      crossOriginEmbedderPolicy: false, // Allow cross-origin for Playground
    })
  );

  // Rate limiting middleware
  app.use(apiLimiter);

  // Serve uploads folder as static files
  app.use('/uploads', express.static(join(__dirname, '../../../uploads')));

  // Enable file upload support for GraphQL
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  const server = new ApolloServer({
    typeDefs,
    resolvers: combinedResolvers, // use merged resolvers for all modules
    context: async ({ req, res }) => {
      console.log('Authorization header:', req.headers.authorization);
      const user = await authenticateJWT(req);
      console.log('Authenticated user:', user);
      // Provide prisma and res for use in resolvers
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      // include req so resolvers can access cookies or other headers when needed
      return { user, prisma, res, req };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();

  server.applyMiddleware({ app, cors: false });

  return app;
}

export default startServer;

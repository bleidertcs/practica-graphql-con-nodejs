import 'dotenv/config';
import http from 'http';
import express, { Request, Response } from 'express';
import cors from 'cors';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { getContainer } from './container/index.js';
import { 
  typeDefs, 
  createResolvers, 
  createDataLoaders, 
  createApolloErrorPlugin,
  type GraphQLContext 
} from './infrastructure/http/graphql/index.js';
import { createRestRouter } from './infrastructure/http/rest/index.js';
import { errorHandler } from './infrastructure/http/middleware/index.js';
import logger from './shared/utils/logger.js';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  // Initialize container (dependency injection)
  const container = getContainer();
  logger.info('Container initialized');

  // Create Express app and HTTP server
  const app = express();
  const httpServer = http.createServer(app);

  // Create Apollo Server
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers: createResolvers(),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      createApolloErrorPlugin(),
    ],
  });

  await server.start();
  logger.info('Apollo Server started');

  // GraphQL endpoint
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({
        db: container.db,
        dataLoaders: createDataLoaders(container.db),
        useCases: {
          // Queries
          listAuthors: container.listAuthorsUseCase,
          listPosts: container.listPostsUseCase,
          // Mutations - Authors
          createAuthor: container.createAuthorUseCase,
          updateAuthor: container.updateAuthorUseCase,
          deleteAuthor: container.deleteAuthorUseCase,
          // Mutations - Posts
          createPost: container.createPostUseCase,
          updatePost: container.updatePostUseCase,
          deletePost: container.deletePostUseCase,
          // Auth
          register: container.registerUseCase,
          login: container.loginUseCase,
        },
      }),
    }),
  );

  // REST endpoints
  app.use(
    '/rest',
    cors(),
    express.json(),
    createRestRouter(container.authorController, container.postController)
  );

  // Root endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ 
      message: 'GraphQL + REST API with Clean Architecture',
      graphql: '/graphql',
      rest: '/rest',
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT || 3001;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
  logger.info(`   GraphQL: http://localhost:${PORT}/graphql`);
  logger.info(`   REST:    http://localhost:${PORT}/rest`);
}

// Run the application
bootstrap().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
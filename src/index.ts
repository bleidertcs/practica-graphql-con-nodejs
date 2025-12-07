import 'dotenv/config';
import http from 'http';
import logger from './utils/logger.js';
import knex, { Knex } from 'knex';
import knexConfig from './knexfile.js';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// Use Express built-in JSON parser (no body-parser dependency)

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createApolloErrorPlugin } from './plugins/apollo-error-plugin.js';

import typeDefs from './schema.js';
import * as resolvers from './resolvers.js';
import { QueryArgs } from './dto/query-args.js';
import { createDataLoaders } from './services/data-loaders.service.js';
import restMiddleware from './rest-middleware.js';
import errorHandler from './middleware/error-handler.js';

const log = logger;
const app = express();
const httpServer = http.createServer(app);

// Extend the Request interface to include the 'db' property
declare global {
  namespace Express {
    interface Request {
      db: Knex;
    }
  }
}

// Conexión a la base de datos
log.info('Intentando conectar a la BD...');
const db: Knex = knex(knexConfig);
log.info('Conexión a la BD exitosa!');

interface MyContext {
  db: Knex;
  dataLoaders: ReturnType<typeof createDataLoaders>;
}

// Configuración del servidor Apollo
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers: {
    Query: {
      authors: async (_: unknown, args: QueryArgs, { db }: { db: Knex }) => await resolvers.Authors(args, db),
      posts: async (_: unknown, args: QueryArgs, { db }: { db: Knex }) => await resolvers.Posts(args, db),
    },
    Post: resolvers.Post,
    Author: resolvers.Author,
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), createApolloErrorPlugin()],
});

await server.start();

// Inyectar la conexión a la BD en `req`
app.use((req: Request, _: Response, next: NextFunction) => {
  req.db = db;
  next();
});

// Endpoint de GraphQL
app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }: { req: Request }) => ({
      db: req.db,
      dataLoaders: createDataLoaders(req.db),
    }),
  }),
);

// Endpoint REST
app.use('/rest', restMiddleware);

// Global error handler (after routes)
app.use(errorHandler);

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  log.debug('¿Tenemos el objeto db? =>', !!req.db);
  res.status(200).end('¡Hola mundo!');
});

// Iniciar el servidor
await new Promise<void>((resolve) => httpServer.listen({ port: 3001 }, resolve));
console.log('🚀 El servidor está corriendo en http://localhost:3001');
import type { ApolloServerPlugin, BaseContext } from '@apollo/server';
import logger from '../../../../shared/utils/logger.js';

/**
 * Apollo Server error logging plugin
 */
export function createApolloErrorPlugin<TContext extends BaseContext>(): ApolloServerPlugin<TContext> {
  return {
    async requestDidStart() {
      return {
        async didEncounterErrors(requestContext) {
          for (const error of requestContext.errors) {
            logger.error('GraphQL Error:', {
              message: error.message,
              path: error.path,
              locations: error.locations,
              extensions: error.extensions,
            });
          }
        },
      };
    },
  };
}

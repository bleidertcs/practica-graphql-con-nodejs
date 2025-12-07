import type { GraphQLRequestContext } from '@apollo/server';
import { HttpError } from '../errors/http-error.js';

export function createApolloErrorPlugin() {
    return {
        async requestDidStart(): Promise<any> {
            return {
                async didEncounterErrors(requestContext: GraphQLRequestContext<any>) {
                    for (const err of requestContext.errors ?? []) {
                        const original = (err as any).originalError;
                        if (original instanceof HttpError) {
                            // Attach the HTTP status to the GraphQL error extensions
                            (err as any).extensions = {
                                ...(err as any).extensions,
                                httpStatus: original.status,
                            };
                        }
                    }
                },
            };
        },
    };
}

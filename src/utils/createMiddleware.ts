import { GraphQLMiddlewareFunction, Resolver } from "../types/graphql-utils";

export const createMiddleware = (middlewareFunc: GraphQLMiddlewareFunction, resolverFunc: Resolver) => (
  parent: any,
  args: any,
  context: any,
  info: any
) => middlewareFunc(resolverFunc, parent, args, context, info);

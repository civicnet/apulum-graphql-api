import { GraphQLSchema } from "graphql";
import { importSchema } from "graphql-import";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";

import * as fs from 'fs';
import * as path from "path";

export const genSchema = () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, '../modules'));

  folders.forEach((folder) => {
      let resolvers = {};
      if (folder !== 'shared') {
        resolvers = require(`../modules/${folder}/resolvers`).resolvers;
      }
      const typeDefs = importSchema(
          path.join(__dirname, `../modules/${folder}/schema.graphql`)
      );

      schemas.push(makeExecutableSchema({
        resolvers,
        typeDefs,
        resolverValidationOptions: {
          requireResolversForResolveType: false
        }
      }));
  })

  return mergeSchemas({ schemas });
}

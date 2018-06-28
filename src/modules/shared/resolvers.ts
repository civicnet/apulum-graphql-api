import { ResolverMap } from "../../types/graphql-utils";
export const resolvers: ResolverMap = {}

/*
  Node: {
    __resolveType: (obj) => {
      if (Object.keys(obj).length !== 4) {
        return null;
      }

      if (obj.id && obj.creator && obj.createdAt && obj.updatedAt) {
        return 'Node';
      }

      return null;
    },
  }, */

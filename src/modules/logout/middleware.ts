import { Resolver } from "../../types/graphql-utils";
// import { logger } from "../../utils/logger";

export default async (resolver: Resolver, ...params: any[]) => {
  if (!params[2].session || !params[2].session.userId) {
    return null;
  }

  // middleware
  const result = await resolver(params[0], params[1], params[2], params[3]);
  // afterware

  return result;
}

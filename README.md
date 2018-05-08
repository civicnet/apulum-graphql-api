# Apulum GraphQL API

`Note: This project, 1% finished. It's in a very early development phase so expect drama.`

A local government CMS API, built on a modern stack, with a focus on migrating tedious offline processes online. 

## Roadmap 

`Coming soon`


## Prerequisites

- Redis
- Node
- yarn
- Typescript
- postgres

## Install locally

```
$> git clone https://github.com/civictechro/apulum-graphql-api.git
$> cd apulum-graphql-api
$> npm install
```
## Config 

```
$> cp .env_sample .env 
$> vim .env // add your SparkPost API Key here
$> vim ormconfig.json // TypeORM configuration
```

## Run

There's no staging or development setup, nor is there any automatization for running this. For now, after install and config, you can run:

```
$> yarn start // starts the server
```

This is just the backend API, but it comes with a GraphQL playground at `https://localhost:4000`.

## Tests

Tests are written with Jest, you'll find them in `__tests__` folders or names `foo.test.ts`.

```
$> yarn test
```

## GraphQL Schemas

Add schemas in the `src/modules` folder (create a new module if it's a completely new type). The module split is convention based, not enforced. 

Each module should contain a `schema.graphql` and a `resolvers.ts`. These are stitched together at runtime. In order to enable `Typescript` typings for the schema, run 

```
$> yarn gen-schema-types
```

This will update `src/types/schema.d.ts` file with the new schema definitions. 

There's also a shared schema in `src/shared.graphql`. This should only contain global types. 

`Note: There's a bug in graphql-yoga at the moment which prevents schema files from skipping the Query type, which is why some of the schemas have a dummy Query type in place.`

[![Heroku](https://badge.glitch.me/karman-graphql-api-prod/heroku)](https://karman-graphql-api-prod.herokuapp.com/)
[![Build Status](https://travis-ci.com/civictechro/apulum-graphql-api.svg?branch=master)](https://travis-ci.com/civictechro/apulum-graphql-api) [![Coverage Status](https://coveralls.io/repos/github/civictechro/apulum-graphql-api/badge.svg?branch=master)](https://coveralls.io/github/civictechro/apulum-graphql-api?branch=master) [![Total Alerts](https://img.shields.io/lgtm/alerts/g/civictechro/apulum-graphql-api.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/civictechro/apulum-graphql-api/alerts/) [![Language Grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/civictechro/apulum-graphql-api.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/civictechro/apulum-graphql-api/context:javascript) [![Known Vulnerabilities](https://snyk.io/test/github/civictechro/apulum-graphql-api/badge.svg)](https://snyk.io/test/github/civictechro/apulum-graphql-api) [![Slack](https://img.shields.io/badge/slack-%23team--alba--iulia-green.svg)](https://civictechro.slack.com/messages/C4Y24QL7M/) 

# Kármán API

Just a codename.

> _The Kármán line, or Karman line, lies at an altitude of 100 km (62 mi; 330,000 ft) above Earth's sea level and commonly represents the boundary between Earth's atmosphere and outer space._

### Stage

`Note: This project, 1% finished. It's in a very early development phase so expect drama.`

A local government CMS API, built on a modern stack, with a focus on migrating tedious offline processes online. 

### Roadmap 

`Coming soon`


### Prerequisites

- Redis
- Node
- yarn
- Typescript
- postgres

### Install locally

```
$> git clone https://github.com/civictechro/apulum-graphql-api.git
$> cd apulum-graphql-api
$> yarn
```

Note that at the moment, due to the fact that we're staging on Heroku, the `install` step also builds the app.

### Config 

```
$> cp .env_sample .env 
$> vim .env // see the Heroku section
$> vim ormconfig.json // TypeORM configuration
```

The only recommended config values for development are:

```
SENDGRID_API_KEY=YOUR_KEY
SESSION_SECRET=YOUR_SECRET
FRONTEND_HOST=YOUR_HOST  # probably http://localhost:3000
PORT=YOUR_PORT
```

### Run locally

```
$> yarn dev 
```

This is just the backend API, but it comes with a GraphQL playground at `https://localhost:4000`.

### Tests

Tests are written with Jest, you'll find them in `__tests__` folders or names `foo.test.ts`.

```
$> yarn test
```

You can check out Jest for more options, such as coverage, etc. 

**NOTE:** There's currently a requirement for tests to run synchronously due to some interference with session data, which slows down testing time quite a bit. Looking to get this fixed soon.

### GraphQL Schemas

Add schemas in the `src/modules` folder (create a new module if it's a completely new type). The module split is convention based, not enforced. 

Each module should contain a `schema.graphql` and a `resolvers.ts`. These are stitched together at runtime. In order to enable `Typescript` typings for the schema, run 

```
$> yarn gen-schema-types
```

This will update `src/types/schema.d.ts` file with the new schema definitions. 

There's also a shared schema in `src/shared.graphql`. This should only contain global types. 

`Note: There's a bug in graphql-yoga at the moment which prevents schema files from skipping the Query type, which is why some of the schemas have a dummy Query type in place.`

## Deploying on Heroku

If you want to run this on Heroku, you'll need the following add-ons:
  - Heroku Postgres
  - Heroku Redis
  - SendGrid (used for sending emails on registration)

Make sure you have the following environment vars setup: 

```
SENDGRID_API_KEY=YOUR_API_KEY
SESSION_SECRET=GENERATED_SECRET
FRONTEND_HOST=APULUM_ADMIN_HOST

# Heroku will set the following, don't touch
REDIS_URL=HEROKU_MANAGED
DATABASE_URL=HEROKU_MANAGED
SENDGRID_PASSWORD=HEROKU_MANAGED
SENDGRID_USERNAME=HEROKU_MANAGED

# The following need to be "extracted" from the DATABASE_URL var that Heroku sets for you
DB_HOST=GET_THIS_FROM_DATABASE_URL
DB_PORT=GET_THIS_FROM_DATABASE_URL
DB_USERNAME=GET_THIS_FROM_DATABASE_URL
DB_PASSWORD=GET_THIS_FROM_DATABASE_URL
DB_DATABASE=GET_THIS_FROM_DATABASE_URL
```

And you should be set! 

## Deploying somewhere else

Deploying somewhere else (AWS, DigitalOcean, toaster) will be a similar process to the Heroku setup:


**Install postgres and redis**
You can also use a remotely-hosted version of these two, if that's what you prefer.

**Environment variables**
Configuration options are set in environment variables. By default we support `.env` so you can just copy the Heroku variables list above and you're good to go.

Note that you won't need `SENDGRID_PASSWORD` and `SENDGRID_USERNAME`, just an API key. Get that from their site. If you installed redis locally, you won't need to add the `REDIS_URL` variable.

**Build and run**
Last step, building and running the project. 

```
$> git clone https://github.com/civictechro/apulum-graphql-api
$> cd apulum-graphql-api && yarn && yarn start
```

The postinstall step builds the `.ts` files and copies static assets (`*.graphql` files) to the `dist`. The start script simply runs `index.js` from the `dist` folder.

Depending on your workflow, you should be able to use this to deploy. Please feel free to write automation for this. 

**Known issues**
```
(node:21536) UnhandledPromiseRejectionWarning: QueryFailedError: function uuid_generate_v4() does not exist

$ sudo -u postgres psql
psql (10.4 (Ubuntu 10.4-0ubuntu0.18.04))
Type "help" for help.

postgres=# \c apulum-graphql-api
You are now connected to database "apulum-graphql-api" as user "postgres".
apulum-graphql-api=# CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION
apulum-graphql-api=# \q
```

Note that you probably will need to install the extension for the test db as well.

Error running `tsc` or `yarn run build-ts`:

```
src/types/schema.d.ts(147,2): error TS1036: Statements are not allowed in ambient contexts.
```

There's a problem with the script that generates the typings for the graphql schemas, it adds an unnecessary semicolon following enum declarations. Remove them and you're good to go.

----------

**Made with :heart: & :coffee: by [CivicTech România](https://civictech.ro/)**

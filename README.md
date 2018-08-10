To run this program:

1. Start a postgres server on your machine (using docker: `docker run -d -p 5432:5432 postgres:10`).
2. Create a database called `ormtest`: `PGHOST=localhost PGUSER=postgres createdb ormtest`.
3. Run `yarn` to install dependencies.
4. Run `yarn start`.


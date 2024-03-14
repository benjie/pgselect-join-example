# Example of using Grafast with pgSelect without PostGraphile

Usage:

```
yarn start
```

And then open http://localhost:5678

And issue query:

```graphql
{
  folders(sortKey: LAST_MODIFIED_FILE_DATE, first: 2) {
    edges {
      node {
        id
        name
        modifiedAt
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

This will create a database called `abecc`, seed it with some nonsense data,
generate a "registry" from it, export that registry as executable code, and then
run our server which will serve up a basic GraphQL schema querying this
database.

The example demonstrates using `join` with `pgSelect` to order a collection by
data in a related table, and also demonstrates selecting values from an SQL
expression (subquery) for use in a GraphQL field.

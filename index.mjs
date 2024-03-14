// @ts-check
import { createServer } from "node:http";
import { connection, makeGrafastSchema } from "grafast";
import { grafserv } from "grafserv/node";
import { preset } from "./preset.mjs";
import { pgRegistry } from "./registry.mjs";
import { sql } from "pg-sql2";
import { TYPES } from "@dataplan/pg";

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    enum FoldersSortKey {
      NAME
      LAST_MODIFIED_FILE_DATE
    }
    type Query {
      folders(
        first: Int
        after: String
        sortKey: FoldersSortKey
      ): FolderConnection!
    }
    type FolderConnection {
      edges: [FolderEdge]
      pageInfo: PageInfo!
    }
    type FolderEdge {
      node: Folder
      cursor: String!
    }
    type Folder {
      id: Int!
      name: String!
      modifiedAt: String
    }
    type PageInfo {
      hasNextPage: Boolean
      hasPreviousPage: Boolean
    }
  `,
  plans: {
    Query: {
      folders(_, { $first, $after, $sortKey }) {
        const $folders = pgRegistry.pgResources.folders.find();
        const $connection = connection($folders);
        $connection.setFirst($first);
        $connection.setAfter($after);
        // Bad practice to use 'eval', instead associate plans with the enum values:
        switch ($sortKey.eval()) {
          case "NAME": {
            $folders.orderBy({
              attribute: "name",
              direction: "ASC",
            });
          }
          case "LAST_MODIFIED_FILE_DATE": {
            const alias = sql.identifier("latest_file");
            $folders.join({
              type: "left",
              from: sql`(
                select ff."folderId", MAX(f."modifiedAt") as "maxModifiedAt"
                from abecc.folder_files ff
                inner join abecc.files f on ff."fileId" = f.id
                group by ff."folderId"
              )`,
              alias,
              conditions: [sql`${alias}."folderId" = ${$folders.alias}.id`],
            });
            $folders.orderBy({
              fragment: sql`${alias}."maxModifiedAt"`,
              codec: TYPES.timestamptz,
              direction: "ASC",
            });
          }
        }
        return $connection;
      },
    },
    Folder: {
      modifiedAt(
        /** @type {import("@dataplan/pg").PgSelectSingleStep} */ $folder,
      ) {
        return $folder.select(
          sql`(
            select max("modifiedAt")
            from abecc.files f
            inner join abecc.folder_files ff
            on (ff."fileId" = f.id)
            where ff."folderId" = ${$folder.getClassStep().alias}.id
          )`,
          TYPES.timestamptz,
        );
      },
    },

    // These won't be needed in the next release of Grafast:
    FolderConnection: {
      edges(
        /** @type {import("grafast").ConnectionStep<any, any, any>} */ $connection,
      ) {
        return $connection.edges();
      },
      pageInfo(
        /** @type {import("grafast").ConnectionStep<any, any, any>} */ $connection,
      ) {
        return $connection.pageInfo();
      },
    },
    FolderEdge: {
      node(/** @type {import("grafast").EdgeStep<any, any, any>} */ $edge) {
        return $edge.node();
      },
      cursor(/** @type {import("grafast").EdgeStep<any, any, any>} */ $edge) {
        return $edge.cursor();
      },
    },
    PageInfo: {
      hasNextPage(
        /** @type {import("grafast").PageInfoCapableStep} */ $pageInfo,
      ) {
        return $pageInfo.hasNextPage();
      },
      hasPreviousPage(
        /** @type {import("grafast").PageInfoCapableStep} */ $pageInfo,
      ) {
        return $pageInfo.hasPreviousPage();
      },
    },
  },
});

// Create a Node HTTP server
const server = createServer();
server.on("error", (e) => {
  console.error(e);
});

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Mount the request handler into a new HTTP server, and register websockets if
// desired
serv.addTo(server).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the Node server
server.listen(preset.grafserv?.port ?? 5678);

console.log("Server started");

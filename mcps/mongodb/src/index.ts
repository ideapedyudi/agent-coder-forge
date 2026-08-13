import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MongoClient, type Db, type Collection, type Document } from "mongodb";
import { z } from "zod";

const MONGODB_URI =
  process.env.MDB_MCP_CONNECTION_STRING || "mongodb://localhost:27017";

let client: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client;
}

function getDb(name: string): Db {
  if (!client) throw new Error("Not connected");
  return client.db(name);
}

function getCollection(dbName: string, collName: string): Collection {
  return getDb(dbName).collection(collName);
}

// ── Schema inference ────────────────────────────────────────────────
function inferSchema(docs: Document[]): Document {
  const schema: Record<string, unknown> = {};
  for (const doc of docs) {
    for (const [key, value] of Object.entries(doc)) {
      if (key === "_id") continue;
      const type = Array.isArray(value)
        ? "array"
        : value === null
          ? "null"
          : typeof value;
      if (!schema[key]) schema[key] = new Set<string>();
      (schema[key] as Set<string>).add(type);
    }
  }
  const result: Record<string, string[]> = {};
  for (const [key, types] of Object.entries(schema)) {
    result[key] = [...(types as Set<string>)];
  }
  return result;
}

// ── Server ──────────────────────────────────────────────────────────
const server = new McpServer({
  name: "mongodb",
  version: "1.0.0",
});

// list-databases
server.tool(
  "list-databases",
  "List all databases on the connected MongoDB server",
  {},
  async () => {
    const mongo = await getClient();
    const admin = mongo.db().admin();
    const { databases } = await admin.listDatabases();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            databases.map((d) => ({ name: d.name, sizeOnDisk: d.sizeOnDisk })),
            null,
            2
          ),
        },
      ],
    };
  }
);

// list-collections
server.tool(
  "list-collections",
  "List collections in a database",
  { database: z.string().describe("Database name") },
  async ({ database }) => {
    const db = getDb(database);
    const collections = await db.listCollections().toArray();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(collections.map((c) => c.name), null, 2),
        },
      ],
    };
  }
);

// find
server.tool(
  "find",
  "Query documents from a MongoDB collection",
  {
    database: z.string(),
    collection: z.string(),
    filter: z.string().optional().describe("JSON filter object"),
    projection: z.string().optional().describe("JSON projection object"),
    sort: z.string().optional().describe("JSON sort object"),
    limit: z.number().optional().default(10),
  },
  async ({ database, collection, filter, projection, sort, limit }) => {
    const coll = getCollection(database, collection);
    const cursor = coll.find(
      filter ? JSON.parse(filter) : {},
      {
        projection: projection ? JSON.parse(projection) : undefined,
        sort: sort ? JSON.parse(sort) : undefined,
        limit,
      }
    );
    const docs = await cursor.toArray();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(docs, null, 2) }],
    };
  }
);

// aggregate
server.tool(
  "aggregate",
  "Run an aggregation pipeline on a MongoDB collection",
  {
    database: z.string(),
    collection: z.string(),
    pipeline: z.string().describe("JSON array of pipeline stages"),
  },
  async ({ database, collection, pipeline }) => {
    const coll = getCollection(database, collection);
    const stages = JSON.parse(pipeline);
    const docs = await coll.aggregate(stages).toArray();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(docs, null, 2) }],
    };
  }
);

// count
server.tool(
  "count",
  "Count documents matching a filter in a MongoDB collection",
  {
    database: z.string(),
    collection: z.string(),
    filter: z.string().optional().describe("JSON filter object"),
  },
  async ({ database, collection, filter }) => {
    const coll = getCollection(database, collection);
    const count = await coll.countDocuments(filter ? JSON.parse(filter) : {});
    return {
      content: [{ type: "text" as const, text: String(count) }],
    };
  }
);

// collection-indexes
server.tool(
  "collection-indexes",
  "List indexes on a MongoDB collection",
  {
    database: z.string(),
    collection: z.string(),
  },
  async ({ database, collection }) => {
    const coll = getCollection(database, collection);
    const indexes = await coll.listIndexes().toArray();
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(indexes, null, 2) },
      ],
    };
  }
);

// collection-schema
server.tool(
  "collection-schema",
  "Infer schema from sample documents in a MongoDB collection",
  {
    database: z.string(),
    collection: z.string(),
    sampleSize: z.number().optional().default(50),
  },
  async ({ database, collection, sampleSize }) => {
    const coll = getCollection(database, collection);
    const docs = await coll.find().limit(sampleSize).toArray();
    const schema = inferSchema(docs);
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(schema, null, 2) },
      ],
    };
  }
);

// db-stats
server.tool(
  "db-stats",
  "Get database statistics",
  {
    database: z.string(),
  },
  async ({ database }) => {
    const db = getDb(database);
    const stats = await db.command({ dbStats: 1 });
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(stats, null, 2) },
      ],
    };
  }
);

// explain
server.tool(
  "explain",
  "Get query execution plan for a find query",
  {
    database: z.string(),
    collection: z.string(),
    filter: z.string().optional().describe("JSON filter object"),
    sort: z.string().optional().describe("JSON sort object"),
    limit: z.number().optional(),
  },
  async ({ database, collection, filter, sort, limit }) => {
    const db = getDb(database);
    const cmd: Record<string, unknown> = {
      find: collection,
      filter: filter ? JSON.parse(filter) : {},
    };
    if (sort) cmd.sort = JSON.parse(sort);
    if (limit) cmd.limit = limit;
    const plan = await db.command({ explain: cmd });
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(plan, null, 2) },
      ],
    };
  }
);

// insert-one
server.tool(
  "insert-one",
  "Insert a single document into a MongoDB collection",
  {
    database: z.string(),
    collection: z.string(),
    document: z.string().describe("JSON document to insert"),
  },
  async ({ database, collection, document }) => {
    const coll = getCollection(database, collection);
    const result = await coll.insertOne(JSON.parse(document));
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { insertedId: result.insertedId.toString() },
            null,
            2
          ),
        },
      ],
    };
  }
);

// update-many
server.tool(
  "update-many",
  "Update documents matching a filter in a MongoDB collection",
  {
    database: z.string(),
    collection: z.string(),
    filter: z.string().describe("JSON filter object"),
    update: z.string().describe("JSON update object"),
  },
  async ({ database, collection, filter, update }) => {
    const coll = getCollection(database, collection);
    const result = await coll.updateMany(
      JSON.parse(filter),
      JSON.parse(update)
    );
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              matchedCount: result.matchedCount,
              modifiedCount: result.modifiedCount,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// delete-many
server.tool(
  "delete-many",
  "Delete documents matching a filter from a MongoDB collection",
  {
    database: z.string(),
    collection: z.string(),
    filter: z.string().describe("JSON filter object"),
  },
  async ({ database, collection, filter }) => {
    const coll = getCollection(database, collection);
    const result = await coll.deleteMany(JSON.parse(filter));
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ deletedCount: result.deletedCount }, null, 2),
        },
      ],
    };
  }
);

// ── Start ───────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("MongoDB MCP server running on stdio");

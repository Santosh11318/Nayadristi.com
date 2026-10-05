import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema.ts";

declare global {
  var _postgresPool: pkg.Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const config: pkg.PoolConfig = process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1") 
            ? false 
            : { rejectUnauthorized: false },
          max: 10,
          connectionTimeoutMillis: 15000,
        }
      : {
          host: process.env.SQL_HOST,
          port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 5432,
          user: process.env.SQL_USER,
          password: process.env.SQL_PASSWORD,
          database: process.env.SQL_DB_NAME,
          max: 10,
          connectionTimeoutMillis: 15000,
        };

    global._postgresPool = new Pool(config);

    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });

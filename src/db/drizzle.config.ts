import { defineConfig } from "drizzle-kit";

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!sqlHost || !sqlDbName || !user || !password) {
  console.log("Missing db credentials in environment variables.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: sqlHost as string,
    user: user as string,
    password: password as string,
    database: sqlDbName as string,
    ssl: false,
  },
});

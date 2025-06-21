import { defineConfig } from "drizzle-kit";

// Use SQLite for development if no DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: databaseUrl.startsWith("file:") ? "better-sqlite" : "postgresql",
  dbCredentials: databaseUrl.startsWith("file:") 
    ? { url: databaseUrl.replace("file:", "") }
    : { url: databaseUrl },
});

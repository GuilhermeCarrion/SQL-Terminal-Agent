import { DatabaseSync } from "node:sqlite";

export function createDb(path = ":memory:") {
  const db = new DatabaseSync(path);

  db.exec(`
        CREATE TABLE IF NOT EXISTS access_logs (
            ip TEXT NOT NULL,
            username TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            loaction TEXT NOT NULL,
            job_area TEXT NOT NULL,
            company TEXT NOT NULL,
            job_title TEXT NOT NULL,
            id TEXT PRIMARY KEY NOT NULL,
            timestamp TIMESTAMP NOT NULL
        )
    `);

  return db;
}

const db = createDb("access_log.db");

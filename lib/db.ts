import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

// process.cwd() = la cartella del progetto (my-app)
const FILE = path.join(process.cwd(), "data", "app.db");

// Le tabelle vengono create la prima volta che si apre il database
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(title) > 0),
    done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  ) STRICT;

  CREATE TABLE IF NOT EXISTS pig (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    number INTEGER NOT NULL DEFAULT 0
  ) STRICT;

  INSERT OR IGNORE INTO pig (id, number) VALUES (1, 0);
`;

// Una sola connessione, anche quando Next.js ricarica i moduli in dev
const store = globalThis as unknown as { db?: DatabaseSync };

// Il database si apre al primo uso: next build carica questo file con più processi
export function getDb(): DatabaseSync {
  if (!store.db) {
    mkdirSync(path.dirname(FILE), { recursive: true });
    const db = new DatabaseSync(FILE);
    db.exec("PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;");
    db.exec(SCHEMA);
    store.db = db;
  }
  return store.db;
}

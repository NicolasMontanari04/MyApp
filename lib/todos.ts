import "server-only";
import { getDb } from "./db";

export type Todo = { id: number; title: string; done: boolean };

// SQLite non ha il tipo boolean: done è salvato come 0 o 1
type TodoRow = { id: number; title: string; done: number };

// Le colonne che ci servono (created_at non lo mandiamo al front-end)
const COLUMNS = "id, title, done";

// Trasforma una riga del database in un Todo, con done booleano.
// Crea anche un oggetto normale: quelli di node:sqlite non hanno prototipo
// e React non li accetta come props per i Client Component.
function toTodo(row: TodoRow): Todo {
  return { id: row.id, title: row.title, done: row.done === 1 };
}

// I "?" sono parametri: il testo dell'utente non entra mai dentro la query,
// e questo protegge dalla SQL injection.

export async function getTodos(): Promise<Todo[]> {
  const rows = getDb().prepare(`SELECT ${COLUMNS} FROM todos ORDER BY id`).all();
  return (rows as TodoRow[]).map(toTodo);
}

export async function findTodo(id: number): Promise<Todo | undefined> {
  const row = getDb().prepare(`SELECT ${COLUMNS} FROM todos WHERE id = ?`).get(id);
  return row ? toTodo(row as TodoRow) : undefined;
}

export async function createTodo(title: string): Promise<Todo> {
  const row = getDb()
    .prepare(`INSERT INTO todos (title) VALUES (?) RETURNING ${COLUMNS}`)
    .get(title);
  return toTodo(row as TodoRow);
}

export async function updateTodo(
  id: number,
  changes: Partial<Pick<Todo, "title" | "done">>
): Promise<Todo | undefined> {
  const title = changes.title ?? null;
  const done = changes.done === undefined ? null : Number(changes.done);
  const row = getDb()
    .prepare(
      // COALESCE(?, title): se il valore è null, resta quello attuale
      `UPDATE todos
       SET title = COALESCE(?, title), done = COALESCE(?, done)
       WHERE id = ?
       RETURNING ${COLUMNS}`
    )
    .get(title, done, id);
  return row ? toTodo(row as TodoRow) : undefined;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const result = getDb().prepare("DELETE FROM todos WHERE id = ?").run(id);
  return result.changes > 0; // true se ha eliminato qualcosa
}

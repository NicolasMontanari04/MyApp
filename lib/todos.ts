import "server-only";
import { supabase } from "./supabase";

export type Todo = { id: number; title: string; done: boolean };

// Le colonne che ci servono (created_at non lo mandiamo al front-end)
const COLUMNS = "id, title, done";

// Ogni chiamata a Supabase restituisce { data, error }.
// Se c'è un errore lo "lanciamo": Next.js risponderà 500 al client.

export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")       // FROM todos
    .select(COLUMNS)     // SELECT id, title, done
    .order("id");        // ORDER BY id
  if (error) throw new Error(error.message);
  return data;
}

export async function findTodo(id: number): Promise<Todo | undefined> {
  const { data, error } = await supabase
    .from("todos")
    .select(COLUMNS)
    .eq("id", id)        // WHERE id = ...
    .maybeSingle();      // al massimo una riga: oggetto oppure null
  if (error) throw new Error(error.message);
  return data ?? undefined; // "??" = se è null, usa undefined
}

export async function createTodo(title: string): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .insert({ title })   // INSERT INTO todos (title) VALUES (...)
    .select(COLUMNS)     // ...e restituisci la riga creata (con l'id nuovo)
    .single();           // esattamente una riga
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTodo(
  id: number,
  changes: Partial<Pick<Todo, "title" | "done">>
): Promise<Todo | undefined> {
  const { data, error } = await supabase
    .from("todos")
    .update(changes)     // UPDATE todos SET ...
    .eq("id", id)        // WHERE id = ...
    .select(COLUMNS)
    .maybeSingle();      // null se l'id non esiste
  if (error) throw new Error(error.message);
  return data ?? undefined;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("todos")
    .delete()            // DELETE FROM todos
    .eq("id", id)        // WHERE id = ...
    .select("id");       // restituisce le righe eliminate
  if (error) throw new Error(error.message);
  return data.length > 0; // true se ha eliminato qualcosa
}
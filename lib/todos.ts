import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import "server-only";

export type Todo = { id: number; title: string; done: boolean };

// process.cwd() = la cartella del progetto (my-app)
const FILE = path.join(process.cwd(), "data", "todos.json");

// Legge tutti i todo dal file
async function load(): Promise<Todo[]> {
  try {
    const text = await readFile(FILE, "utf-8");
    return JSON.parse(text); // testo JSON -> array di oggetti
  } catch {
    return []; // il file non esiste ancora: lista vuota
  }
}

// Scrive tutti i todo nel file
async function save(todos: Todo[]): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true }); // crea "data/" se manca
  await writeFile(FILE, JSON.stringify(todos, null, 2)); // null, 2 = JSON indentato
}

export async function getTodos(): Promise<Todo[]> {
  return load();
}

export async function findTodo(id: number): Promise<Todo | undefined> {
  const todos = await load();
  return todos.find((t) => t.id === id);
}

export async function createTodo(title: string): Promise<Todo> {
  const todos = await load();
  // nuovo id = id più alto + 1 (0 se la lista è vuota)
  const nextId = Math.max(0, ...todos.map((t) => t.id)) + 1;
  const todo: Todo = { id: nextId, title, done: false };
  todos.push(todo);
  await save(todos);
  return todo;
}

// Partial<...> = un oggetto con ALCUNI di questi campi, non per forza tutti
export async function updateTodo(
  id: number,
  changes: Partial<Pick<Todo, "title" | "done">>
): Promise<Todo | undefined> {
  const todos = await load();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return undefined;
  Object.assign(todo, changes); // copia i campi di changes dentro todo
  await save(todos);
  return todo;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const todos = await load();
  const rest = todos.filter((t) => t.id !== id); // tutti tranne quello
  if (rest.length === todos.length) return false; // non c'era
  await save(rest);
  return true;
}
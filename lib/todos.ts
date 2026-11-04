import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Inizializzazione dell'adapter passando l'oggetto di configurazione richiesto da Prisma 7
const adapter = new PrismaBetterSqlite3({ url: "prisma/dev.db" });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type Todo = { id: number; title: string; done: boolean };

// Legge tutti i todo dal database SQLite
export async function getTodos(): Promise<Todo[]> {
  return await prisma.todo.findMany({
    select: { id: true, title: true, done: true },
    orderBy: { id: "asc" },
  });
}

// Trova un singolo todo per id
export async function findTodo(id: number): Promise<Todo | undefined> {
  const todo = await prisma.todo.findUnique({
    where: { id },
    select: { id: true, title: true, done: true },
  });
  return todo ?? undefined;
}

// Inserisce un nuovo todo
export async function createTodo(title: string): Promise<Todo> {
  return await prisma.todo.create({
    data: { title, done: false },
    select: { id: true, title: true, done: true },
  });
}

// Aggiorna un todo esistente
export async function updateTodo(
  id: number,
  changes: Partial<Pick<Todo, "title" | "done">>
): Promise<Todo | undefined> {
  try {
    return await prisma.todo.update({
      where: { id },
      data: changes,
      select: { id: true, title: true, done: true },
    });
  } catch {
    return undefined;
  }
}

// Elimina un todo
export async function deleteTodo(id: number): Promise<boolean> {
  try {
    await prisma.todo.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}
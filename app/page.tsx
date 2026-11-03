import { Suspense } from "react";
import { connection } from "next/server";
import { getTodos } from "@/lib/todos";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import TodoList from "./todo-list";

// Server Component: la parte fissa della pagina
export default function Home() {
  return (
    <main className="flex flex-col items-center p-16">
      <h1 className="text-3xl font-bold mb-8">Le mie cose da fare</h1>
      {/* Mentre i dati arrivano, si vede il fallback */}
      <Suspense fallback={<p>Caricamento...</p>}>
        <TodosLoader />
      </Suspense>
      <Link href="/test" className={buttonVariants()}>
        Vai alle info
      </Link>
    </main>
  );
}

// Server Component asincrono: legge i todo sul server e li passa al client
async function TodosLoader() {
  await connection(); // dati che cambiano: leggili a ogni richiesta, non alla build
  const todos = await getTodos();
  return <TodoList initialTodos={todos} />;
}

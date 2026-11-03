import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getCount } from "@/lib/counts";
import Counter from "./counter";

// Server Component: la parte fissa della pagina
export default function Prova() {
  return (
    <main className="flex flex-col items-center gap-8 p-16">
      <h1 className="text-3xl font-bold">Contatore</h1>
      {/* Mentre il valore arriva da Supabase, si vede il fallback */}
      <Suspense fallback={<p>Caricamento...</p>}>
        <CounterLoader />
      </Suspense>
      <Link href="/" className={buttonVariants({ })}>
        Torna alla lista
      </Link>
    </main>
  );
}

// Server Component asincrono: legge il valore sul server e lo passa al client
async function CounterLoader() {
  await connection(); // dato che cambia: leggilo a ogni richiesta
  const value = await getCount();
  return <Counter initialValue={value} />;
}
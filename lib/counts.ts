import "server-only";
import { getDb } from "./db";

const COUNT_ID = 1; // l'unica riga della tabella

// Legge il valore attuale
export async function getCount(): Promise<number> {
  const row = getDb().prepare("SELECT number FROM pig WHERE id = ?").get(COUNT_ID);
  return (row as { number: number }).number;
}

// Aumenta di 1 con una sola istruzione SQL, così nessun clic va perso
export async function incrementCount(): Promise<number> {
  const row = getDb()
    .prepare("UPDATE pig SET number = number + 1 WHERE id = ? RETURNING number")
    .get(COUNT_ID);
  return (row as { number: number }).number;
}

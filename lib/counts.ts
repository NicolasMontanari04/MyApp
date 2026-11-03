import "server-only";
import { supabase } from "./supabase";

const TABLE = "Pig";
const COUNT_ID = 1; // l'unica riga della tabella

// Legge il valore attuale
export async function getCount(): Promise<number> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("Number")
        .eq("id", COUNT_ID)
        .single();
    if (error) throw new Error(error.message);
    return data.Number;
}

// Aumenta di 1 nel database (funzione SQL increment_count) e restituisce il nuovo valore
export async function incrementCount(): Promise<number> {
    const { data, error } = await supabase.rpc("increment_count");
    if (error) throw new Error(error.message);
    return data;
}
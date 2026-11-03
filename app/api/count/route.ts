import { connection } from "next/server";
import { getCount, incrementCount } from "@/lib/counts";

// GET /api/count -> { value: 5 }
export async function GET() {
  await connection();
  return Response.json({ value: await getCount() });
}

// POST /api/count -> aumenta di 1 e restituisce { value: 6 }
export async function POST() {
  return Response.json({ value: await incrementCount() });
}
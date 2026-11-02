import { connection } from "next/server";
import { getTodos, createTodo } from "@/lib/todos";

export async function GET() {
  await connection();
  return Response.json(await getTodos());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (typeof body.title !== "string" || body.title.trim() === "") {
    return Response.json({ error: "titolo obbligatorio" }, { status: 400 });
  }
  return Response.json(await createTodo(body.title), { status: 201 });
}
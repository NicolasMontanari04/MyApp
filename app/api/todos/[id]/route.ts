import { findTodo, updateTodo, deleteTodo } from "@/lib/todos";

// RouteContext<"/api/todos/[id]"> è un tipo che Next.js genera da solo:
// sa che ctx.params contiene { id: string }
async function getId(ctx: RouteContext<"/api/todos/[id]">) {
  const { id } = await ctx.params; // params è una Promise: serve await
  return Number(id); // dall'URL arriva sempre una stringa: "1" -> 1
}

export async function GET(_req: Request, ctx: RouteContext<"/api/todos/[id]">) {
  const todo = await findTodo(await getId(ctx));
  if (!todo) return Response.json({ error: "non trovato" }, { status: 404 });
  return Response.json(todo);
}

export async function PATCH(req: Request, ctx: RouteContext<"/api/todos/[id]">) {
  const body = await req.json();
  const changes: { title?: string; done?: boolean } = {};
  if (typeof body.title === "string") changes.title = body.title;
  if (typeof body.done === "boolean") changes.done = body.done;

  const todo = await updateTodo(await getId(ctx), changes);
  if (!todo) return Response.json({ error: "non trovato" }, { status: 404 });
  return Response.json(todo);
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/todos/[id]">) {
  if (!(await deleteTodo(await getId(ctx)))) {
    return Response.json({ error: "non trovato" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}

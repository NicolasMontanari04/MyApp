"use client";

import { useState } from "react";
import type { Todo } from "@/lib/todos"; // import type, importa solo il tipo, non il codice
import TodoItem from "./todo-item";
import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// initialTodos arriva da page.tsx, già letto sul server
export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  // useState: una variabile che, quando cambia, ridisegna il componente
  const [todos, setTodos] = useState<Todo[]>(initialTodos); // parte già piena
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // true mentre aspettiamo il server

  // Chiede la lista al back-end (GET /api/todos)
  async function loadTodos() {
    const res = await fetch("/api/todos");
    setTodos(await res.json());
  }

  // POST /api/todos
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        const data = await res.json(); // il back-end manda errore
        setError(data.error);
        return; // esce dalla funzione: non svuota il campo e non ricarica
      }

      setError(null);
      setTitle("");
      await loadTodos();
    } finally {
      setLoading(false); // "finally" viene eseguito sempre, anche dopo il return
    }
  }

  // PATCH /api/todos/:id
  async function toggleTodo(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    loadTodos();
  }

  // DELETE /api/todos/:id
  async function removeTodo(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    loadTodos();
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cosa devi fare?"
          aria-label="Nuovo todo"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Salvo..." : "Aggiungi"}
        </Button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onRemove={removeTodo} />
        ))}
      </ul>
    </div>
  );
}

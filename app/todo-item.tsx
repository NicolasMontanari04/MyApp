"use client";


import type { Todo } from "@/lib/todos";
import {Button} from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Le props del componente: cosa riceve dal "padre" (TodoList)
type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => void; // una funzione che riceve un Todo e non restituisce nulla
  onRemove: (id: number) => void;
};

// Mostra un singolo todo. Non sa nulla di fetch o API:
// quando l'utente clicca, avvisa il padre chiamando onToggle / onRemove.
export default function TodoItem({ todo, onToggle, onRemove }: Props) {
  return (
    <li className="flex items-center justify-between border-b py-2">
      <label className={`flex items-center gap-2 ${todo.done ? "line-through text-gray-400" : ""}`}>
        <Checkbox
          checked={todo.done}
          onCheckedChange={() => onToggle(todo)}
          className="mr-2"
        />
        {todo.title}
      </label>
      <Button variant="ghost" size="icon" aria-label="Elimina" onClick={() => onRemove(todo.id)}>
        X
      </Button>
    </li>
  );
}

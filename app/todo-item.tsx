"use client";


import type { Todo } from "@/lib/todos";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
      <Label className={cn(todo.done && "line-through text-muted-foreground")}>
        <Checkbox
          checked={todo.done}
          onCheckedChange={() => onToggle(todo)}
        />
        {todo.title}
      </Label>
      <Button variant="ghost" size="icon" aria-label="Elimina" onClick={() => onRemove(todo.id)}>
        X
      </Button>
    </li>

  );
}

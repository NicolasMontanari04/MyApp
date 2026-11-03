"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Counter({ initialValue }: { initialValue: number }) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function increment() {
    setLoading(true);
    try {
      const res = await fetch("/api/count", { method: "POST" });
      if (!res.ok) return;
      const data: { value: number } = await res.json();
      setValue(data.value); // il valore vero, dal server
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-4xl font-bold tabular-nums">{value}</span>
      <Button onClick={increment} disabled={loading}>
        +1
      </Button>
    </div>
  );
}
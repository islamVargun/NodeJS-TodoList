"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export default function WeeklyTodoForm({ dayDate, onAddTask }) {
  const [task, setTask] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (task.trim()) {
        onAddTask(task, dayDate);
        setTask("");
      }
    }
  };

  return (
    <div className="relative mt-2">
      <Plus className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Yeni görev ekle (Enter)"
        className="pl-8"
      />
    </div>
  );
}

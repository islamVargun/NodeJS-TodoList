"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TodoForm({ onAddTask }) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(newTask);
    setNewTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        placeholder="Yeni bir görev ekle..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">Ekle</Button>
    </form>
  );
}

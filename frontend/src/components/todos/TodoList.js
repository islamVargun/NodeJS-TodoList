"use client";

import { Loader2 } from "lucide-react";
import { SortableTodoItem } from "./SortableTodoItem";
import { AnimatePresence } from "framer-motion";

export default function TodoList({
  todos,
  isLoading,
  error,
  onToggle,
  onDelete,
  onEdit,
  onSelectTask, // YENİ
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Yükleniyor...
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive text-center mt-8">Hata: {error}</p>;
  }

  if (todos.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-8">
        Henüz bir görev eklenmedi.
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <AnimatePresence>
        {todos.map((todo) => (
          <SortableTodoItem
            key={todo._id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            onSelectTask={onSelectTask} // YENİ
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TodoItem from "./TodoItem";
import { motion } from "framer-motion";

export function SortableTodoItem({ todo, onSelectTask, ...props }) {
  // onSelectTask eklendi
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -300, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <TodoItem
        todo={todo}
        {...props}
        onSelectTask={onSelectTask} // YENİ
        attributes={attributes}
        listeners={listeners}
      />
    </motion.div>
  );
}

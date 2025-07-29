"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import TodoForm from "@/components/todos/TodoForm";
import TodoList from "@/components/todos/TodoList";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { useAuth } from "@/context/AuthContext";
import { TaskDetailSheet } from "@/components/todos/TaskDetailSheet";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function HomePage() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // YENİ: Yan panel state'leri
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/todos`;

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Görevler yüklenemedi.");
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTask = async (taskText, dueDate) => {
    if (!taskText.trim()) {
      toast.error("Görev alanı boş olamaz.");
      return;
    }
    const promise = fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify({ task: taskText, dueDate: dueDate }),
    });
    toast.promise(promise, {
      loading: "Görev ekleniyor...",
      success: (response) => {
        if (!response.ok) throw new Error("Görev eklenemedi.");
        fetchTodos();
        return "Yeni görev başarıyla eklendi!";
      },
      error: "Görev eklenirken bir hata oluştu.",
    });
  };

  const handleToggleTodo = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Görev güncellenemedi.");
      fetchTodos();
      toast.success(
        currentStatus
          ? 'Görev "yapılacak" olarak işaretlendi.'
          : 'Görev "tamamlandı" olarak işaretlendi.'
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Görev arşivlenemedi.");
      fetchTodos();
      toast.success("Görev başarıyla arşivlendi.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditTodo = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Görev güncellenemedi.");

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, ...updates } : todo
        )
      );

      setSelectedTask((prevTask) =>
        prevTask && prevTask._id === id ? { ...prevTask, ...updates } : prevTask
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setIsSheetOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        const orderedIds = newOrder.map((item) => item._id);
        updateTodoOrder(orderedIds);
        return newOrder;
      });
    }
  };

  const updateTodoOrder = async (orderedIds) => {
    try {
      const response = await fetch(`${API_URL}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ orderedIds }),
      });
      if (!response.ok) throw new Error("Sıralama güncellenemedi.");
    } catch (err) {
      toast.error(err.message);
      fetchTodos();
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <TaskDetailSheet
        task={selectedTask}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onUpdateTask={handleEditTodo}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Tüm Görevler</h1>
          <ThemeToggleButton />
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Yeni Görev Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <TodoForm onAddTask={handleAddTask} />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={todos.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <TodoList
                  todos={todos}
                  isLoading={isLoading}
                  error={error}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                  onSelectTask={handleSelectTask}
                />
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

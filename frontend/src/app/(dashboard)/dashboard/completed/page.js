"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import TodoList from "@/components/todos/TodoList";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { useAuth } from "@/context/AuthContext";

export default function CompletedPage() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/todos`;

  const fetchCompletedTodos = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/completed`, {
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Tamamlanmış görevler yüklenemedi.");
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
    fetchCompletedTodos();
  }, [fetchCompletedTodos]);

  const handleToggleTodo = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Görev güncellenemedi.");
      fetchCompletedTodos();
      toast.success('Görev "yapılacak" olarak işaretlendi.');
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
      fetchCompletedTodos();
      toast.success("Görev başarıyla arşivlendi.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditTodo = async (id, updates) => {
    const promise = fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify(updates),
    });
    toast.promise(promise, {
      loading: "Görev güncelleniyor...",
      success: (response) => {
        if (!response.ok) throw new Error("Görev güncellenemedi.");
        fetchCompletedTodos();
        return "Görev başarıyla güncellendi!";
      },
      error: "Görev güncellenirken bir hata oluştu.",
    });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Yapılan Görevler</h1>
          <ThemeToggleButton />
        </div>
        <Card className="w-full">
          <CardContent className="pt-6">
            <TodoList
              todos={todos}
              isLoading={isLoading}
              error={error}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}

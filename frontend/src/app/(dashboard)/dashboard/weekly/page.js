"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { SortableTodoItem } from "@/components/todos/SortableTodoItem";
import { AddTaskDialog } from "@/components/todos/AddTaskDialog";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { format, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { TaskDetailSheet } from "@/components/todos/TaskDetailSheet"; // YENİ: Görev detayı paneli import edildi

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

export default function WeeklyPlannerPage() {
  const [weeklyData, setWeeklyData] = useState({});
  const [weekRange, setWeekRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDateForDialog, setSelectedDateForDialog] = useState(null);
  const { token } = useAuth();

  // YENİ: Yan panel için state'ler eklendi
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/todos`;

  const fetchWeeklyTodos = useCallback(
    async (date) => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/weekly?date=${date.toISOString()}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        if (!response.ok) throw new Error("Haftalık görevler yüklenemedi.");
        const data = await response.json();
        setWeeklyData(data.weekData || {});
        setWeekRange({
          start: new Date(data.weekRange.start),
          end: new Date(data.weekRange.end),
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchWeeklyTodos(currentDate);
  }, [currentDate, fetchWeeklyTodos]);

  const handleOpenDialog = (date) => {
    setSelectedDateForDialog(date);
    setIsDialogOpen(true);
  };

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
        fetchWeeklyTodos(currentDate);
        setIsDialogOpen(false);
        return "Yeni görev başarıyla eklendi!";
      },
      error: "Görev eklenirken bir hata oluştu.",
    });
  };

  const handleToggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Görev güncellenemedi.");
      fetchWeeklyTodos(currentDate);
      toast.success("Görevin durumu değiştirildi.");
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
      fetchWeeklyTodos(currentDate);
      toast.success("Görev başarıyla arşivlendi.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // GÜNCELLEME: Yan panelden gelen güncellemeleri işleyecek fonksiyon
  const handleEditTodo = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Görev güncellenemedi.");

      fetchWeeklyTodos(currentDate);

      setSelectedTask((prevTask) =>
        prevTask && prevTask._id === id ? { ...prevTask, ...updates } : prevTask
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // YENİ: Bir göreve tıklandığında yan paneli açan fonksiyon
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setIsSheetOpen(true);
  };

  const changeWeek = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + amount);
    setCurrentDate(newDate);
  };

  const getWeekRangeTitle = () => {
    if (!weekRange.start || !weekRange.end) return "";
    return `${format(weekRange.start, "d MMMM", { locale: tr })} - ${format(
      weekRange.end,
      "d MMMM yyyy",
      { locale: tr }
    )}`;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateTodoOrderOnServer = async (orderedIds) => {
    const allTaskIds = Object.values(weeklyData)
      .flat()
      .map((t) => t._id);
    const finalOrderedIds = orderedIds.concat(
      allTaskIds.filter((id) => !orderedIds.includes(id))
    );

    try {
      await fetch(`${API_URL}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ orderedIds: finalOrderedIds }),
      });
    } catch (err) {
      toast.error("Sıralama güncellenemedi.");
      fetchWeeklyTodos(currentDate);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let sourceDay = null;
    let targetDay = null;

    for (const day in weeklyData) {
      if (weeklyData[day].some((todo) => todo._id === active.id))
        sourceDay = day;
      if (weeklyData[day].some((todo) => todo._id === over.id)) targetDay = day;
    }

    if (sourceDay && targetDay && sourceDay === targetDay) {
      setWeeklyData((prev) => {
        const newDayTasks = arrayMove(
          prev[sourceDay],
          prev[sourceDay].findIndex((t) => t._id === active.id),
          prev[sourceDay].findIndex((t) => t._id === over.id)
        );

        const allTasks = Object.values({
          ...prev,
          [sourceDay]: newDayTasks,
        }).flat();
        updateTodoOrderOnServer(allTasks.map((t) => t._id));

        return { ...prev, [sourceDay]: newDayTasks };
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AddTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddTask={handleAddTask}
        defaultDate={selectedDateForDialog}
      />
      {/* YENİ: Görev detayı paneli render ediliyor */}
      <TaskDetailSheet
        task={selectedTask}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onUpdateTask={handleEditTodo}
      />
      <div className="flex flex-col h-full">
        <header className="flex-shrink-0 p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeWeek(-7)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl lg:text-2xl font-bold text-center sm:text-left">
                {getWeekRangeTitle()}
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeWeek(7)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="self-end sm:self-center">
              <ThemeToggleButton />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" /> Yükleniyor...
            </div>
          ) : error ? (
            <p className="text-red-500 text-center mt-16">Hata: {error}</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 h-full">
                {Object.keys(weeklyData).map((day, index) => {
                  const dayDate = new Date(weekRange.start);
                  dayDate.setDate(dayDate.getDate() + index);
                  const dayTasks = weeklyData[day];
                  const today = isToday(dayDate);

                  return (
                    <div
                      key={day}
                      className={cn(
                        "flex flex-col rounded-lg bg-card/50 dark:bg-card/20 p-3 border",
                        today && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-baseline gap-2">
                          <h2 className="font-semibold">{day}</h2>
                          <p
                            className={cn(
                              "text-sm",
                              today
                                ? "text-primary font-bold"
                                : "text-muted-foreground"
                            )}
                          >
                            {format(dayDate, "d")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleOpenDialog(dayDate)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1 space-y-3 overflow-y-auto">
                        <SortableContext
                          items={dayTasks.map((t) => t._id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {dayTasks.length > 0 ? (
                            dayTasks.map((todo) => (
                              <SortableTodoItem
                                key={todo._id}
                                todo={todo}
                                onToggle={() => handleToggleTodo(todo._id)}
                                onDelete={() => handleDeleteTodo(todo._id)}
                                onEdit={handleEditTodo}
                                onSelectTask={handleSelectTask} // GÜNCELLEME: Prop eklendi
                              />
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground pt-2 text-center">
                              Görev yok
                            </p>
                          )}
                        </SortableContext>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DndContext>
          )}
        </main>
      </div>
    </>
  );
}

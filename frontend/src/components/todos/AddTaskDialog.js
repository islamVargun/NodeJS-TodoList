"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function AddTaskDialog({ open, onOpenChange, onAddTask, defaultDate }) {
  const [task, setTask] = useState("");

  const handleSubmit = () => {
    if (task.trim()) {
      onAddTask(task, defaultDate);
      setTask("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Görev Ekle</DialogTitle>
          <DialogDescription>
            {defaultDate
              ? format(defaultDate, "d MMMM yyyy", { locale: tr })
              : ""}{" "}
            tarihi için yeni bir görev oluşturun.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task" className="text-right">
              Görev
            </Label>
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
            Görevi Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

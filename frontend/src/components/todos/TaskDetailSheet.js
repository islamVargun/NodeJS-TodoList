"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter, // YENİ
  SheetClose, // YENİ
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function TaskDetailSheet({ task, open, onOpenChange, onUpdateTask }) {
  const [editedTask, setEditedTask] = useState(task);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedTask(task);
    setHasChanges(false); // Panel her açıldığında değişiklik durumunu sıfırla
  }, [task, open]);

  if (!task) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true); // Bir değişiklik yapıldığını işaretle
  };

  const handleSaveChanges = () => {
    if (hasChanges) {
      onUpdateTask(task._id, {
        task: editedTask.task,
        description: editedTask.description,
      });
    }
    onOpenChange(false); // Paneli kapat
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Görev Detayları</SheetTitle>
          <SheetDescription>
            Görevin detaylarını görüntüle ve düzenle. Bitirdiğinde kaydet
            butonuna tıkla.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task">Görev Adı</Label>
            <Input
              id="task"
              name="task"
              value={editedTask?.task || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Görev için notlar ekle..."
              value={editedTask?.description || ""}
              onChange={handleInputChange}
              rows={8}
            />
          </div>
        </div>
        {/* YENİ: Kaydet butonu için footer eklendi */}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">İptal</Button>
          </SheetClose>
          <Button onClick={handleSaveChanges} disabled={!hasChanges}>
            Değişiklikleri Kaydet
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

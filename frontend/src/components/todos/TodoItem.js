"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, GripVertical, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  formatDistanceToNowStrict,
  isToday,
  isTomorrow,
  isPast,
} from "date-fns";
import { tr } from "date-fns/locale";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);

  if (isToday(date)) {
    return null;
  }

  let formattedDate = "";
  let variant = "secondary";

  if (isTomorrow(date)) {
    formattedDate = "Yarın";
    variant = "outline";
  } else if (isPast(date)) {
    formattedDate = formatDistanceToNowStrict(date, {
      addSuffix: true,
      locale: tr,
    });
    variant = "destructive";
  } else {
    formattedDate = formatDistanceToNowStrict(date, {
      addSuffix: true,
      locale: tr,
    });
    variant = "secondary";
  }

  return { text: formattedDate, variant };
};

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onSelectTask,
  attributes,
  listeners,
}) {
  const dueDateInfo = formatDate(todo.dueDate);

  const handleTaskClick = (e) => {
    if (
      e.target.closest(
        'button, [role="checkbox"], [aria-label="Görevi sürükle"]'
      )
    ) {
      return;
    }
    // GÜNCELLEME: onSelectTask fonksiyonunun varlığını kontrol et
    if (typeof onSelectTask === "function") {
      onSelectTask(todo);
    }
  };

  return (
    <div
      className="flex items-center justify-between p-3 bg-muted rounded-md cursor-pointer hover:bg-accent"
      onClick={handleTaskClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-1"
          aria-label="Görevi sürükle"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <Checkbox
          id={todo._id}
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo._id, todo.completed)}
        />
        <div className="flex flex-col gap-1.5 min-w-0">
          <label
            htmlFor={todo._id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate",
              todo.completed && "line-through text-muted-foreground"
            )}
            title={todo.task}
          >
            {todo.task}
          </label>
          {dueDateInfo && (
            <Badge variant={dueDateInfo.variant} className="w-fit">
              <CalendarIcon className="h-3 w-3 mr-1.5" />
              {dueDateInfo.text}
            </Badge>
          )}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu görev kalıcı olarak arşivlenecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => onDelete(todo._id)}
            >
              Arşivle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

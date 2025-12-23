import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./task-card";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

const statusTitles: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  blocked: "Blocked",
  done: "Done",
};

const statusColors: Record<TaskStatus, string> = {
    todo: "bg-gray-500",
    "in-progress": "bg-blue-500",
    blocked: "bg-red-500",
    done: "bg-green-500",
};

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const title = statusTitles[status];

  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between p-2 mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
          <h2 className="font-semibold text-foreground">{title}</h2>
        </div>
        <span className="text-sm text-muted-foreground">{tasks.length}</span>
      </div>
      <div className="flex-grow space-y-3 overflow-y-auto p-1 -m-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <div className="mt-3">
        <Card className="bg-transparent">
            <CardContent className="p-2">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        form.reset();
                    }}
                >
                <div className="flex items-center gap-2">
                    <Input name="title" placeholder="Add a new task..." className="bg-card/50 h-9" />
                    <Button type="submit" size="icon" variant="ghost" className="shrink-0 h-9 w-9">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

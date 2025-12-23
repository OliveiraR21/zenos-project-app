"use client"
import { tasks as allTasks } from "@/lib/placeholder-data";
import { KanbanColumn } from "./kanban-column";
import type { TaskStatus } from "@/lib/types";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";

interface KanbanBoardProps {
  projectId: string;
}

const statuses: TaskStatus[] = ["todo", "in-progress", "blocked", "done"];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const projectTasks = allTasks.filter((task) => task.projectId === projectId);

  return (
    <div>
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4"/>
                Filter
            </Button>
            {/* Add more filters like 'Only my tasks', 'Overdue' */}
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 -m-1 p-1">
        {statuses.map((status) => (
            <KanbanColumn
            key={status}
            status={status}
            tasks={projectTasks.filter((task) => task.status === status)}
            />
        ))}
        </div>
    </div>
  );
}

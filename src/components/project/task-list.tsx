"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { tasks as allTasks, users } from "@/lib/placeholder-data";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { TaskDetailsSheet } from "./task-details-sheet";
import { useEffect, useState } from "react";
  
interface TaskListProps {
    projectId: string;
}

const priorityClasses: Record<Task['priority'], string> = {
    low: 'bg-blue-500/20 text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400',
};

const priorityLabels: Record<Task['priority'], string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
};

function TaskRow({ task }: { task: Task }) {
    const assignee = users.find((user) => user.id === task.assigneeId);
    
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        const date = task.dueDate ? new Date(task.dueDate) : null;
        setDueDate(date);
        setIsOverdue(date ? date < new Date() : false);
    }, [task.dueDate]);

    return (
        <TaskDetailsSheet task={task}>
            <TableRow className="cursor-pointer">
                <TableCell className="w-12">
                    <Checkbox checked={task.status === 'done'}/>
                </TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                    {assignee && (
                        <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                                <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                                <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline">{assignee.name}</span>
                        </div>
                    )}
                </TableCell>
                <TableCell className={cn(isOverdue ? "text-red-400" : "")}>
                    {dueDate?.toLocaleDateString()}
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className={cn("size-3 rounded-full", priorityClasses[task.priority])} />
                        <span className="capitalize">{priorityLabels[task.priority]}</span>
                    </div>
                </TableCell>
            </TableRow>
        </TaskDetailsSheet>
    )
}

export function TaskList({ projectId }: TaskListProps) {
    const projectTasks = allTasks.filter((task) => task.projectId === projectId);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12"><Checkbox /></TableHead>
                    <TableHead>
                        <Button variant="ghost">
                            Nome da Tarefa <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost">
                            Responsável <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost">
                            Data de Vencimento <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                         <Button variant="ghost">
                            Prioridade <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projectTasks.map(task => <TaskRow key={task.id} task={task} />)}
            </TableBody>
        </Table>
    )
}

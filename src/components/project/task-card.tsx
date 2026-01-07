"use client"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import type { Task, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarIcon, GripVertical, MessageSquare, Paperclip } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import { TaskDetailsSheet } from "./task-details-sheet";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { doc, Timestamp } from "firebase/firestore";

interface TaskCardProps {
    task: Task;
}

const priorityClasses: Record<Task['priority'], string> = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const priorityTooltips: Record<Task['priority'], string> = {
    low: 'Prioridade baixa',
    medium: 'Prioridade média',
    high: 'Prioridade alta',
}

export function TaskCard({ task }: TaskCardProps) {
    const firestore = useFirestore();

    const assigneeRef = useMemoFirebase(() => {
        if (!firestore || !task.assigneeId) return null;
        return doc(firestore, "users", task.assigneeId);
    }, [firestore, task.assigneeId]);

    const { data: assignee } = useDoc<User>(assigneeRef);
    
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        if (task.dueDate && task.dueDate.toDate) { // Check if it's a Firestore Timestamp
            const date = task.dueDate.toDate();
            setDueDate(date);
            setIsOverdue(date < new Date() && task.status !== 'done');
        } else if (task.dueDate) { // Handle string dates for backward compatibility
            const date = new Date(task.dueDate);
            setDueDate(date);
            setIsOverdue(date < new Date() && task.status !== 'done');
        }
    }, [task.dueDate, task.status]);


    return (
        <TaskDetailsSheet task={task}>
            <Card className="group cursor-grab active:cursor-grabbing bg-card/50 hover:bg-card transition-colors">
                <CardHeader className="p-3 pb-2">
                    <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-medium group-hover:text-primary transition-colors leading-tight pr-2">{task.title}</CardTitle>
                    <GripVertical className="size-5 text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground transition-colors" />
                    </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        {task.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {task.comments && task.comments.length > 0 && 
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MessageSquare className="size-4" /> {task.comments.length}
                            </span>
                        }
                        {task.attachments && task.attachments.length > 0 && 
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Paperclip className="size-4" /> {task.attachments.length}
                            </span>
                        }
                        {dueDate && (
                            <span className={cn(
                                "flex items-center gap-1.5 text-xs",
                                isOverdue ? "text-red-400" : "text-muted-foreground"
                            )}>
                                <CalendarIcon className="size-4" /> {dueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                <div className={cn("size-3 rounded-full border", priorityClasses[task.priority])} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{priorityTooltips[task.priority]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {assignee && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Avatar className="size-7">
                                            <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Atribuído a {assignee.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </TaskDetailsSheet>
    )
}

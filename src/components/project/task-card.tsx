"use client"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/placeholder-data";
import type { Task } from "@/lib/types";
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

interface TaskCardProps {
    task: Task;
}

const priorityClasses: Record<Task['priority'], string> = {
    low: 'bg-blue-500/20 text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400',
};

export function TaskCard({ task }: TaskCardProps) {
    const assignee = users.find((user) => user.id === task.assigneeId);
    
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue = dueDate && dueDate < new Date();

    return (
        <TaskDetailsSheet task={task}>
            <Card className="group cursor-grab active:cursor-grabbing bg-card/50 hover:bg-card transition-colors">
                <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">{task.title}</CardTitle>
                    <GripVertical className="size-5 text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground transition-colors" />
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        {task.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {task.comments.length > 0 && 
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="size-4" /> {task.comments.length}
                            </span>
                        }
                        {task.attachments.length > 0 && 
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Paperclip className="size-4" /> {task.attachments.length}
                            </span>
                        }
                        {dueDate && (
                            <span className={cn(
                                "flex items-center gap-1 text-xs",
                                isOverdue ? "text-red-400" : "text-muted-foreground"
                            )}>
                                <CalendarIcon className="size-4" /> {dueDate.toLocaleDateString()}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                <div className={cn("size-3 rounded-full", priorityClasses[task.priority])} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="capitalize">{task.priority} priority</p>
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
                                        <p>Assigned to {assignee.name}</p>
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

"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/placeholder-data";
import type { Task, TaskStatus, TaskPriority } from "@/lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Checkbox } from "../ui/checkbox";
import { CalendarIcon, Paperclip, Send, User, Users, Tag, ListChecks, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface TaskDetailsSheetProps {
    task: Task;
    children: React.ReactNode;
}

const statusOptions: {value: TaskStatus, label: string}[] = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "blocked", label: "Blocked" },
    { value: "done", label: "Done" },
];

const priorityOptions: {value: TaskPriority, label: string}[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

export function TaskDetailsSheet({ task, children }: TaskDetailsSheetProps) {
    const assignee = users.find((user) => user.id === task.assigneeId);
    const subtaskProgress = task.subtasks.length > 0 ? (task.subtasks.filter(st => st.isCompleted).length / task.subtasks.length) * 100 : 0;
    
    // Simulate other users viewing this task
    const viewingUsers = users.slice(2, 4);

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <Input className="text-2xl font-semibold tracking-tight border-0 shadow-none focus-visible:ring-0 px-0" defaultValue={task.title} />
                    <SheetDescription>
                        In project <a href="#" className="font-medium text-primary hover:underline">{task.projectId}</a>
                    </SheetDescription>
                </SheetHeader>
                <div className="py-8 grid gap-8">
                    {/* Description */}
                    <div className="grid gap-2">
                        <h3 className="font-semibold flex items-center"><Type className="mr-2 size-4 text-muted-foreground"/> Description</h3>
                        <Textarea defaultValue={task.description} rows={4} className="bg-card"/>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center"><User className="mr-2 size-4"/>Assignee</h4>
                            <Select defaultValue={assignee?.id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center"><CalendarIcon className="mr-2 size-4"/>Due Date</h4>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={task.dueDate ? new Date(task.dueDate) : undefined} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                             <Select defaultValue={task.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Set status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Priority</h4>
                            <Select defaultValue={task.priority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Set priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="grid gap-2">
                        <h3 className="font-semibold flex items-center"><Tag className="mr-2 size-4 text-muted-foreground"/> Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {task.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="grid gap-3">
                        <h3 className="font-semibold flex items-center"><ListChecks className="mr-2 size-4 text-muted-foreground"/> Subtasks</h3>
                        <Progress value={subtaskProgress} className="h-2" />
                        <div className="space-y-2">
                            {task.subtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center gap-2 p-2 bg-card rounded-md">
                                    <Checkbox checked={subtask.isCompleted} />
                                    <Input defaultValue={subtask.title} className={cn("border-0 h-auto p-0 bg-transparent text-sm", subtask.isCompleted && "line-through text-muted-foreground")} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attachments */}
                     <div className="grid gap-2">
                        <h3 className="font-semibold flex items-center"><Paperclip className="mr-2 size-4 text-muted-foreground"/> Attachments</h3>
                        <p className="text-sm text-muted-foreground">No attachments yet. <Button variant="link" className="p-0 h-auto">Add one</Button></p>
                    </div>

                    <Separator />

                    {/* Comments */}
                    <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Activity</h3>
                            <div className="flex items-center -space-x-2">
                                {viewingUsers.map(user => (
                                    <Avatar key={user.id} className="size-7 border-2 border-background">
                                        <AvatarImage src={user.avatarUrl} alt={user.name}/>
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Avatar className="size-9">
                                <AvatarImage src={users[0].avatarUrl} alt={users[0].name} />
                                <AvatarFallback>{users[0].name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="w-full">
                                <Textarea placeholder="Write a comment..." className="mb-2 bg-card"/>
                                <Button size="sm">
                                    Send <Send className="ml-2 size-4"/>
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {task.comments.map(comment => {
                                const author = users.find(u => u.id === comment.authorId);
                                return (
                                <div key={comment.id} className="flex gap-3">
                                    <Avatar className="size-9">
                                        <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                                        <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-sm">{author?.name}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm text-foreground/80">{comment.content}</p>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

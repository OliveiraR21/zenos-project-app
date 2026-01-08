'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Task, TaskStatus, TaskPriority, User, Comment, Subtask, Project } from '@/lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import {
  CalendarIcon,
  Paperclip,
  Send,
  User as UserIcon,
  ListChecks,
  Type,
  Tag,
  Plus,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useEffect, useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, useDoc } from '@/firebase';
import { useTaskPresence } from '@/hooks/use-task-presence';
import { collection, doc, serverTimestamp, Timestamp, query, where } from 'firebase/firestore';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '../ui/tooltip';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface TaskDetailsSheetProps {
  task: Task;
  children: React.ReactNode;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'A Fazer' },
  { value: 'in-progress', label: 'Em Progresso' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'done', label: 'Concluído' },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

function TaskDetails({ task }: { task: Task }) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const { viewingUsers } = useTaskPresence(
    task.id,
    currentUser
  );

  const [localTask, setLocalTask] = useState<Task>(task);
  const [newComment, setNewComment] = useState("");
  const [newSubtask, setNewSubtask] = useState("");

  const projectRef = useMemoFirebase(() => {
    if (!firestore || !task.projectId) return null;
    return doc(firestore, 'projects', task.projectId);
  }, [firestore, task.projectId]);
  const { data: project } = useDoc<Project>(projectRef);

  const membersQuery = useMemoFirebase(() => {
    if (!firestore || !project?.memberIds || project.memberIds.length === 0) return null;
    return query(collection(firestore, 'users'), where('id', 'in', project.memberIds));
  }, [firestore, project]);
  const { data: projectMembers } = useCollection<User>(membersQuery);

  const allUsers = useMemo(() => {
    if(!viewingUsers || !projectMembers) return [];
    const all = [...viewingUsers, ...(projectMembers || [])];
    return all.filter((u, i, a) => a.findIndex(t => t.id === u.id) === i);
  }, [viewingUsers, projectMembers])


  useEffect(() => {
    setLocalTask(task);
  }, [task]);
  
  const assignee = allUsers?.find((user) => user.id === localTask.assigneeId);
  const subtasks = localTask.subtasks || [];
  const comments = localTask.comments || [];

  const subtaskProgress =
    subtasks.length > 0
      ? (subtasks.filter((st) => st.isCompleted).length /
          subtasks.length) *
        100
      : 0;

  const [dueDate, setDueDate] = useState<Date | null>(null);

  useEffect(() => {
    if (localTask.dueDate && localTask.dueDate.toDate) {
      const date = localTask.dueDate.toDate();
      setDueDate(date);
    } else if (localTask.dueDate) {
      const date = new Date(localTask.dueDate);
      setDueDate(date);
    } else {
      setDueDate(null);
    }
  }, [localTask.dueDate]);


  const updateTask = (field: keyof Task, value: any) => {
    if (!firestore || !localTask.projectId || !localTask.id) return;
    const taskRef = doc(firestore, 'projects', localTask.projectId, 'tasks', localTask.id);
    let updateValue = value;
    if (field === 'dueDate' && value instanceof Date) {
        updateValue = Timestamp.fromDate(value);
    }
    updateDocumentNonBlocking(taskRef, { [field]: updateValue });
  };
  
  const handleAddComment = () => {
    if (!currentUser || !newComment.trim() || !localTask.projectId) return;

    const newCommentObj: Comment = {
      id: doc(collection(firestore, 'dummy')).id, // temporary client-side id
      authorId: currentUser.uid,
      content: newComment,
      createdAt: serverTimestamp(),
    };

    const updatedComments = [...(localTask.comments || []), newCommentObj];
    updateTask('comments', updatedComments);
    setNewComment("");
  };

  const handleSubtaskChange = (subtaskId: string, isCompleted: boolean) => {
      const updatedSubtasks = (localTask.subtasks || []).map(st => 
        st.id === subtaskId ? { ...st, isCompleted } : st
      );
      updateTask('subtasks', updatedSubtasks);
  }

  const handleAddSubtask = () => {
      if (!newSubtask.trim()) return;
      const newSubtaskObj: Subtask = {
          id: doc(collection(firestore, 'dummy')).id,
          title: newSubtask,
          isCompleted: false,
      };
      const updatedSubtasks = [...(localTask.subtasks || []), newSubtaskObj];
      updateTask('subtasks', updatedSubtasks);
      setNewSubtask("");
  }


  return (
    <>
      <SheetHeader className='pr-10'>
        <SheetTitle asChild>
          <Input
            className="text-2xl font-semibold tracking-tight border-0 shadow-none focus-visible:ring-0 px-0 h-auto"
            defaultValue={localTask.title}
            onBlur={(e) => updateTask('title', e.target.value)}
          />
        </SheetTitle>
        <SheetDescription>
          No projeto{' '}
          <Link
            href={`/project/${localTask.projectId}/board`}
            className="font-medium text-primary hover:underline"
          >
            {project?.name || localTask.projectId}
          </Link>
        </SheetDescription>
      </SheetHeader>
      <div className="py-8 grid gap-8 pr-10">
        {/* Description */}
        <div className="grid gap-2">
          <h3 className="font-semibold flex items-center text-muted-foreground">
            <Type className="mr-2 size-4" /> Descrição
          </h3>
          <Textarea
            defaultValue={localTask.description}
            rows={4}
            className="bg-card/50"
            placeholder='Adicione uma descrição mais detalhada...'
            onBlur={(e) => updateTask('description', e.target.value)}
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center">
              <UserIcon className="mr-2 size-4" />
              Responsável
            </h4>
            <Select defaultValue={assignee?.id} onValueChange={(val) => updateTask('assigneeId', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {projectMembers?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className='flex items-center gap-2'>
                        <Avatar className='size-6'>
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center">
              <CalendarIcon className="mr-2 size-4" />
              Data de Vencimento
            </h4>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    dueDate.toLocaleDateString('pt-BR')
                  ) : (
                    <span>Escolha uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate ?? undefined}
                  onSelect={(day) => {
                    setDueDate(day || null);
                    updateTask('dueDate', day || null);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Status
            </h4>
            <Select defaultValue={localTask.status} onValueChange={(val: TaskStatus) => updateTask('status', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Definir status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Prioridade
            </h4>
            <Select defaultValue={localTask.priority} onValueChange={(val: TaskPriority) => updateTask('priority', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Definir prioridade" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags */}
        <div className="grid gap-2">
          <h3 className="font-semibold flex items-center text-muted-foreground">
            <Tag className="mr-2 size-4" /> Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {localTask.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
             <p className="text-sm text-muted-foreground">
                <Button variant="link" className="p-0 h-auto">
                    Adicionar tags
                </Button>
             </p>
          </div>
        </div>

        {/* Subtasks */}
        <div className="grid gap-3">
          <h3 className="font-semibold flex items-center text-muted-foreground">
            <ListChecks className="mr-2 size-4" />{' '}
            Subtarefas
          </h3>
          {subtasks.length > 0 && <Progress value={subtaskProgress} className="h-2" />}
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 p-2 bg-card rounded-md hover:bg-card/80 transition-colors group"
              >
                <Checkbox 
                    checked={subtask.isCompleted} 
                    onCheckedChange={(checked) => handleSubtaskChange(subtask.id, !!checked)}
                />
                <Input
                  defaultValue={subtask.title}
                  className={cn(
                    'border-0 h-auto p-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0',
                    subtask.isCompleted && 'line-through text-muted-foreground'
                  )}
                />
                 <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input 
                placeholder="Adicionar subtarefa e pressionar Enter" 
                className="bg-card/50"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
            />
            <Button onClick={handleAddSubtask}><Plus className='mr-2 size-4'/> Adicionar</Button>
          </div>
        </div>

        {/* Attachments */}
        <div className="grid gap-2">
          <h3 className="font-semibold flex items-center text-muted-foreground">
            <Paperclip className="mr-2 size-4" /> Anexos
          </h3>
          <p className="text-sm text-muted-foreground">
            Nenhum anexo ainda.{' '}
            <Button variant="link" className="p-0 h-auto">
              Adicionar um
            </Button>
          </p>
        </div>

        <Separator />

        {/* Comments */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Atividade</h3>
            <TooltipProvider>
              <div className="flex items-center -space-x-2">
                {viewingUsers.map((user) => (
                  <Tooltip key={user.id}>
                    <TooltipTrigger asChild>
                      <Avatar className="size-8 border-2 border-background">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.name} está visualizando</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
          <div className="flex gap-3">
            <Avatar className="size-9">
              {currentUser && (
                <AvatarImage
                  src={currentUser.photoURL || undefined}
                  alt={currentUser.displayName || ''}
                />
              )}
              {currentUser && (
                <AvatarFallback>
                  {currentUser.displayName?.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="w-full">
              <Textarea
                placeholder="Escreva um comentário..."
                className="mb-2 bg-card/50"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                Enviar <Send className="ml-2 size-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            {comments.slice().reverse().map((comment) => {
              const author = allUsers?.find((u) => u.id === comment.authorId);
              const [commentDate, setCommentDate] = useState('');
              useEffect(() => {
                if (comment.createdAt && comment.createdAt.toDate) {
                    setCommentDate(comment.createdAt.toDate().toLocaleString('pt-BR'));
                } else if (comment.createdAt) {
                    setCommentDate(new Date(comment.createdAt).toLocaleString('pt-BR'))
                }
              }, [comment.createdAt]);

              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                    <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{author?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {commentDate}
                      </p>
                    </div>
                    <p className="text-sm text-foreground/80 bg-card p-2 rounded-md">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export function TaskDetailsSheet({ task, children }: TaskDetailsSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation(); // Impede que o clique se propague para outros elementos
          setIsOpen(true);
        }}
      >
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <TaskDetails task={task} />
      </SheetContent>
    </Sheet>
  );
}

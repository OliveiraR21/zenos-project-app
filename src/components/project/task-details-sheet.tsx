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
import { collection, doc, serverTimestamp, Timestamp, query, where, documentId, arrayUnion, arrayRemove } from 'firebase/firestore';
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

function TaskDetails({ task: initialTask }: { task: Task }) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // Use a real-time listener for the task itself
  const taskRef = useMemoFirebase(() => {
    if (!firestore || !initialTask.projectId || !initialTask.id) return null;
    return doc(firestore, 'projects', initialTask.projectId, 'tasks', initialTask.id);
  }, [firestore, initialTask.projectId, initialTask.id]);

  const { data: task, isLoading: isTaskLoading } = useDoc<Task>(taskRef);


  const { viewingUsers } = useTaskPresence(
    initialTask.id,
    currentUser
  );

  const [newComment, setNewComment] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const projectRef = useMemoFirebase(() => {
    if (!firestore || !task?.projectId) return null;
    return doc(firestore, 'projects', task.projectId);
  }, [firestore, task?.projectId]);
  const { data: project } = useDoc<Project>(projectRef);

  const membersQuery = useMemoFirebase(() => {
    if (!firestore || !project?.memberIds || project.memberIds.length === 0) return null;
    return query(collection(firestore, 'users'), where(documentId(), 'in', project.memberIds));
  }, [firestore, project]);
  const { data: projectMembers, isLoading: areMembersLoading } = useCollection<User>(membersQuery);

  const commentsQuery = useMemoFirebase(() => {
     if (!firestore || !task?.id) return null;
     return collection(firestore, 'projects', task.projectId, 'tasks', task.id, 'comments');
  }, [firestore, task?.id, task?.projectId]);
  const {data: comments} = useCollection<Comment>(commentsQuery);

  // Combine members and viewers into a single list of users for lookups
  const allUsersMap = useMemo(() => {
    const userMap = new Map<string, User>();
    const addUser = (user: User) => user && user.id && !userMap.has(user.id) && userMap.set(user.id, user);

    viewingUsers.forEach(addUser);
    projectMembers?.forEach(addUser);
    
    return userMap;
  }, [viewingUsers, projectMembers]);


  const subtasks = task?.subtasks || [];
  
  const subtaskProgress =
    subtasks.length > 0
      ? (subtasks.filter((st) => st.isCompleted).length /
          subtasks.length) *
        100
      : 0;

  const dueDate = useMemo(() => {
    if (task?.dueDate && task.dueDate.toDate) {
      return task.dueDate.toDate();
    }
    return null;
  }, [task?.dueDate]);


  const updateTask = (field: keyof Task, value: any) => {
    if (!taskRef) return;
    let updateValue = value;
    if (field === 'dueDate' && value instanceof Date) {
        updateValue = Timestamp.fromDate(value);
    }
    updateDocumentNonBlocking(taskRef, { [field]: updateValue });
  };
  
  const handleAddComment = () => {
    if (!currentUser || !newComment.trim() || !commentsQuery) return;
    
    addDoc(commentsQuery, {
      content: newComment,
      authorId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setNewComment("");
  };

  const handleSubtaskChange = (subtaskId: string, isCompleted: boolean) => {
      const updatedSubtasks = (task?.subtasks || []).map(st => 
        st.id === subtaskId ? { ...st, isCompleted } : st
      );
      updateTask('subtasks', updatedSubtasks);
  }

  const handleAddSubtask = () => {
      if (!newSubtaskTitle.trim() || !task) return;
      const newSubtaskObj: Subtask = {
          id: doc(collection(firestore, 'dummy')).id, // temporary client-side id
          title: newSubtaskTitle,
          isCompleted: false,
      };
      // Use arrayUnion to add a new subtask
      updateDocumentNonBlocking(taskRef, { subtasks: arrayUnion(newSubtaskObj) });
      setNewSubtaskTitle("");
  }
  
  const handleDeleteSubtask = (subtaskToDelete: Subtask) => {
    if (!taskRef) return;
    // Use arrayRemove to delete a subtask
    updateDocumentNonBlocking(taskRef, { subtasks: arrayRemove(subtaskToDelete) });
  };


  if (isTaskLoading || !task) {
    return <div>Carregando tarefa...</div>
  }
  
  const assignee = allUsersMap.get(task.assigneeId || '');

  return (
    <>
      <SheetHeader className='pr-10'>
        <SheetTitle asChild>
          <Input
            className="text-2xl font-semibold tracking-tight border-0 shadow-none focus-visible:ring-0 px-0 h-auto"
            defaultValue={task.title}
            onBlur={(e) => updateTask('title', e.target.value)}
          />
        </SheetTitle>
        <SheetDescription>
          No projeto{' '}
          <Link
            href={`/project/${task.projectId}/board`}
            className="font-medium text-primary hover:underline"
          >
            {project?.name || task.projectId}
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
            defaultValue={task.description}
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
                 <SelectValue placeholder={areMembersLoading ? "Carregando..." : "Selecione"} />
              </SelectTrigger>
              <SelectContent>
                {projectMembers?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className='flex items-center gap-2'>
                        <Avatar className='size-6'>
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.displayName}</span>
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
                  onSelect={(day) => updateTask('dueDate', day || null)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Status
            </h4>
            <Select defaultValue={task.status} onValueChange={(val: TaskStatus) => updateTask('status', val)}>
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
            <Select defaultValue={task.priority} onValueChange={(val: TaskPriority) => updateTask('priority', val)}>
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
            {task.tags?.map((tag) => (
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
                 <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteSubtask(subtask)}>
                    <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleAddSubtask(); }} className="flex items-center gap-2">
            <Input 
                placeholder="Adicionar subtarefa e pressionar Enter" 
                className="bg-card/50"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
            />
            <Button type="submit"><Plus className='mr-2 size-4'/> Adicionar</Button>
          </form>
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
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.displayName} está visualizando</p>
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
            {comments?.slice().reverse().map((comment) => {
              const author = allUsersMap.get(comment.authorId);
              const commentDate = comment.createdAt?.toDate()?.toLocaleString('pt-BR') || 'agora';

              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={author?.photoURL} alt={author?.displayName} />
                    <AvatarFallback>{author?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{author?.displayName}</p>
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
        {isOpen && <TaskDetails task={task} />}
      </SheetContent>
    </Sheet>
  );
}

'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Task, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { TaskDetailsSheet } from './task-details-sheet';
import { useEffect, useState } from 'react';
import { collection, doc } from 'firebase/firestore';

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
  const firestore = useFirestore();
  const assigneeRef = useMemoFirebase(() => {
    if (!firestore || !task.assigneeId) return null;
    return doc(firestore, 'users', task.assigneeId);
  },[firestore, task.assigneeId]);

  const { data: assignee } = useDoc<User>(assigneeRef);

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
          <Checkbox checked={task.status === 'done'} />
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
        <TableCell className={cn(isOverdue ? 'text-red-400' : '')}>
          {dueDate?.toLocaleDateString()}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'size-3 rounded-full',
                priorityClasses[task.priority]
              )}
            />
            <span className="capitalize">{priorityLabels[task.priority]}</span>
          </div>
        </TableCell>
      </TableRow>
    </TaskDetailsSheet>
  );
}

export function TaskList({ projectId }: TaskListProps) {
  const firestore = useFirestore();

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !projectId) return null;
    return collection(firestore, 'projects', projectId, 'tasks');
  }, [firestore, projectId]);

  const { data: projectTasks, isLoading } = useCollection<Task>(tasksQuery);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox />
          </TableHead>
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
        {isLoading && (
          <TableRow>
            <TableCell colSpan={5}>Carregando tarefas...</TableCell>
          </TableRow>
        )}
        {projectTasks?.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </TableBody>
    </Table>
  );
}

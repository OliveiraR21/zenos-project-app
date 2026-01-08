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
import { ArrowUpDown, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { TaskDetailsSheet } from './task-details-sheet';
import { useEffect, useState, useMemo } from 'react';
import { collection, doc } from 'firebase/firestore';
import { NewTaskDialog } from './new-task-dialog';

interface TaskListProps {
  projectId: string;
}

type SortKey = 'title' | 'dueDate' | 'priority';
type SortDirection = 'asc' | 'desc';

const priorityOrder: Record<Task['priority'], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

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
  }, [firestore, task.assigneeId]);

  const { data: assignee } = useDoc<User>(assigneeRef);

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (task.dueDate && task.dueDate.toDate) {
      const date = task.dueDate.toDate();
      setDueDate(date);
      setIsOverdue(date < new Date() && task.status !== 'done');
    } else if (task.dueDate) {
      const date = new Date(task.dueDate);
      setDueDate(date);
      setIsOverdue(date < new Date() && task.status !== 'done');
    }
  }, [task.dueDate, task.status]);

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
          {dueDate?.toLocaleDateString('pt-BR')}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'size-2 rounded-full',
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
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !projectId) return null;
    return collection(firestore, 'projects', projectId, 'tasks');
  }, [firestore, projectId]);

  const { data: projectTasks, isLoading } = useCollection<Task>(tasksQuery);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    if (!projectTasks) return [];
    return [...projectTasks].sort((a, b) => {
      let compareA: any;
      let compareB: any;

      if (sortKey === 'priority') {
        compareA = priorityOrder[a.priority];
        compareB = priorityOrder[b.priority];
      } else if (sortKey === 'dueDate') {
        compareA = a.dueDate ? (a.dueDate.toDate ? a.dueDate.toDate() : new Date(a.dueDate)) : new Date(0);
        compareB = b.dueDate ? (b.dueDate.toDate ? b.dueDate.toDate() : new Date(b.dueDate)) : new Date(0);
      } else {
        compareA = a[sortKey];
        compareB = b[sortKey];
      }

      if (compareA < compareB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [projectTasks, sortKey, sortDirection]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <NewTaskDialog projectId={projectId}>
           <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </NewTaskDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('title')}>
                Nome da Tarefa <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">
                Responsável 
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('dueDate')}>
                Data de Vencimento <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('priority')}>
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
          {sortedTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

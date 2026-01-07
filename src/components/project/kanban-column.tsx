'use client';
import type { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { useAuth, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

const statusTitles: Record<TaskStatus, string> = {
  todo: 'A Fazer',
  'in-progress': 'Em Progresso',
  blocked: 'Bloqueado',
  done: 'Concluído',
};

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  blocked: 'bg-red-500',
  done: 'bg-green-500',
};

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const title = statusTitles[status];
  const { user } = useAuth();
  const firestore = useFirestore();
  const params = useParams();
  const projectId = params.projectId as string;
  const { toast } = useToast();

  const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !firestore || !projectId) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const taskTitle = formData.get('title') as string;

    if (!taskTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'O título não pode estar vazio',
      });
      return;
    }

    try {
      const tasksCollection = collection(
        firestore,
        'projects',
        projectId,
        'tasks'
      );
      addDocumentNonBlocking(tasksCollection, {
        title: taskTitle,
        status: status,
        priority: 'medium', // Default priority
        createdAt: serverTimestamp(),
        projectId: projectId,
      });
      form.reset();
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar tarefa',
        description: 'Não foi possível criar a nova tarefa. Tente novamente.',
      });
    }
  };

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
            <form onSubmit={handleAddTask}>
              <div className="flex items-center gap-2">
                <Input
                  name="title"
                  placeholder="Adicionar uma nova tarefa..."
                  className="bg-card/50 h-9"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 h-9 w-9"
                >
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

'use client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { KanbanColumn } from './kanban-column';
import type { Task, TaskStatus } from '@/lib/types';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';
import { collection } from 'firebase/firestore';

interface KanbanBoardProps {
  projectId: string;
}

const statuses: TaskStatus[] = ['todo', 'in-progress', 'blocked', 'done'];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const firestore = useFirestore();
  
  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !projectId) return null;
    return collection(firestore, 'projects', projectId, 'tasks');
  }, [firestore, projectId]);

  const { data: projectTasks, isLoading } = useCollection<Task>(tasksQuery);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
        {/* Add more filters like 'Only my tasks', 'Overdue' */}
      </div>
      {isLoading && <p>Carregando tarefas...</p>}
      <div className="flex gap-6 overflow-x-auto pb-4 -m-1 p-1">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={projectTasks?.filter((task) => task.status === status) || []}
          />
        ))}
      </div>
    </div>
  );
}

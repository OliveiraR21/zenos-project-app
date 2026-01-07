'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { ProjectCard } from '@/components/dashboard/project-card';
import { NewProjectDialog } from '@/components/dashboard/new-project-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import { collection } from 'firebase/firestore';
import type { Project } from '@/lib/types';

// export const metadata: Metadata = {
//   title: "Painel",
// };

export default function DashboardPage() {
  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects');
  }, [firestore]);
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
        <NewProjectDialog>
          <Button className="hidden md:flex">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </NewProjectDialog>
      </div>
      {isLoading && <p>Carregando projetos...</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className="md:hidden fixed bottom-6 right-6">
        <NewProjectDialog>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Novo Projeto</span>
          </Button>
        </NewProjectDialog>
      </div>
    </AppLayout>
  );
}

'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { ProjectCard } from '@/components/dashboard/project-card';
import { NewProjectDialog } from '@/components/dashboard/new-project-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { collection, query, where } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // This single query is enough because memberIds always includes the owner.
    return query(
      collection(firestore, 'projects'),
      where('memberIds', 'array-contains', user.uid)
    );
  }, [firestore, user]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  if (isUserLoading || isLoading) {
    return <AppLayout>Carregando projetos...</AppLayout>;
  }

  if (!user) {
    return null;
  }

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

      {projects && projects.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">Nenhum projeto encontrado</h2>
            <p className="text-muted-foreground mt-2">
            Comece criando um novo projeto para organizar suas tarefas.
            </p>
            <NewProjectDialog>
                <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Projeto
                </Button>
            </NewProjectDialog>
        </div>
      )}

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

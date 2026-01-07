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
    return query(
      collection(firestore, 'projects'),
      where('memberIds', 'array-contains', user.uid)
    );
  }, [firestore, user]);

  const ownedProjectsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'projects'),
      where('ownerId', '==', user.uid)
    );
  }, [firestore, user]);

  const { data: memberProjects, isLoading: memberLoading } =
    useCollection<Project>(projectsQuery);
  const { data: ownedProjects, isLoading: ownerLoading } =
    useCollection<Project>(ownedProjectsQuery);

  if (isUserLoading || memberLoading || ownerLoading) {
    return <AppLayout>Carregando projetos...</AppLayout>;
  }
  
  if (!user) {
    return null;
  }

  const projects = [
    ...(ownedProjects || []),
    ...(memberProjects || []),
  ].filter((p, i, a) => a.findIndex(t => t.id === p.id) === i);


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

      {projects.length === 0 && (
        <p>Você ainda não faz parte de nenhum projeto.</p>
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

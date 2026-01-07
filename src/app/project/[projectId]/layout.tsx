'use client';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { doc } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { ProjectTabs } from './project-tabs';
import type { Project } from '@/lib/types';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.projectId as string;
  const firestore = useFirestore();
  const projectRef = useMemoFirebase(() => {
    if (!firestore || !projectId) return null;
    return doc(firestore, 'projects', projectId);
  }, [firestore, projectId]);

  const { data: project, isLoading } = useDoc<Project>(projectRef);

  if (isLoading) {
    return <AppLayout>Carregando...</AppLayout>;
  }

  if (!project) {
    notFound();
  }

  const headerContent = (
    <div className="flex flex-col">
      <h1 className="font-semibold text-xl">{project.name}</h1>
      <p className="text-sm text-muted-foreground">{project.description}</p>
    </div>
  );

  return (
    <AppLayout headerContent={headerContent}>
      <ProjectTabs projectId={project.id}>{children}</ProjectTabs>
    </AppLayout>
  );
}

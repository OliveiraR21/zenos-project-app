import { AppLayout } from "@/components/app-layout";
import { projects } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import { ProjectTabs } from "./project-tabs";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const { projectId } = params;
  const project = projects.find((p) => p.id === projectId);

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
      <ProjectTabs projectId={project.id}>
        {children}
      </ProjectTabs>
    </AppLayout>
  );
}

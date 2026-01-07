import { KanbanBoard } from "@/components/project/kanban-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quadro",
};

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <div>
      <KanbanBoard projectId={projectId} />
    </div>
  );
}

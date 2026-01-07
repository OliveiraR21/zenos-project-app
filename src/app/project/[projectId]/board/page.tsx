import { KanbanBoard } from "@/components/project/kanban-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quadro",
};

export default function ProjectBoardPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div>
      <KanbanBoard projectId={params.projectId} />
    </div>
  );
}
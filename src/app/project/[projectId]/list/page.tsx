import { TaskList } from "@/components/project/task-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista",
};

export default function ProjectListPage({
  params: { projectId },
}: {
  params: { projectId: string };
}) {
  return (
    <div>
      <TaskList projectId={projectId} />
    </div>
  );
}

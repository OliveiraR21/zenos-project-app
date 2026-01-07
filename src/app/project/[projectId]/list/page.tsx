import { TaskList } from "@/components/project/task-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista",
};

export default function ProjectListPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div>
      <TaskList projectId={params.projectId} />
    </div>
  );
}
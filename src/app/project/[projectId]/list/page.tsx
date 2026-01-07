import { TaskList } from "@/components/project/task-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista",
};

export default async function ProjectListPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <div>
      <TaskList projectId={projectId} />
    </div>
  );
}

"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ListTodo, Trello } from "lucide-react";

export function ProjectTabs({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const pathname = usePathname();
  const activeTab = pathname.includes("/list") ? "list" : "board";

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList>
        <TabsTrigger value="board" asChild>
          <Link href={`/project/${projectId}/board`}>
            <Trello className="mr-2 size-4" /> Quadro
          </Link>
        </TabsTrigger>
        <TabsTrigger value="list" asChild>
          <Link href={`/project/${projectId}/list`}>
            <ListTodo className="mr-2 size-4" /> Lista
          </Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-6">{children}</div>
    </Tabs>
  );
}

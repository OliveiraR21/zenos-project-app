"use client"

import { AppLayout } from "@/components/app-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ListTodo, Trello } from "lucide-react";
import React from 'react';
import type { Project } from "@/lib/types";

export default function ProjectLayout({
  children,
  params,
  project
}: {
  children: React.ReactNode;
  params: { projectId: string };
  project: Project
}) {
  const pathname = usePathname();
  const activeTab = pathname.includes("/list") ? "list" : "board";

  const headerContent = (
    <div className="flex flex-col">
        <h1 className="font-semibold text-xl">{project.name}</h1>
        <p className="text-sm text-muted-foreground">{project.description}</p>
    </div>
  )

  return (
    <AppLayout headerContent={headerContent}>
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="board" asChild>
            <Link href={`/project/${project.id}/board`}><Trello className="mr-2 size-4" /> Quadro</Link>
          </TabsTrigger>
          <TabsTrigger value="list" asChild>
            <Link href={`/project/${project.id}/list`}><ListTodo className="mr-2 size-4" /> Lista</Link>
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          {children}
        </div>
      </Tabs>
    </AppLayout>
  );
}
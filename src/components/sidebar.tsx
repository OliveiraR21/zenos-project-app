'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Bell, Home, Settings, SquareKanban } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Project } from '@/lib/types';
import { collection } from 'firebase/firestore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(
    () => {
      if (!firestore) return null;
      return collection(firestore, 'projects');
    },
    [firestore]
  );
  
  const { data: projects } = useCollection<Project>(projectsQuery);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 w-full p-2 justify-center">
          <Image
            src="/zenos_sem_fundo_claro.png"
            alt="Zenos Logo"
            width={24}
            height={24}
          />
          <span className="font-display text-2xl tracking-wider text-foreground truncate">
            Zenos
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div
          className={cn(
            'flex flex-col w-full h-full',
            state === 'collapsed' && 'items-center'
          )}
        >
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard'}
                tooltip={{ children: 'Painel' }}
              >
                <Link href="/dashboard">
                  <Home />
                  <span>Painel</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/notifications'}
                tooltip={{ children: 'Notificações' }}
              >
                <Link href="/notifications">
                  <Bell />
                  <span>Notificações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip={{ children: 'Configurações' }}
              >
                <Link href="/settings">
                  <Settings />
                  <span>Configurações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Projetos</SidebarGroupLabel>
            <SidebarMenu>
              {projects?.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(`/project/${project.id}`)}
                    tooltip={{ children: project.name }}
                  >
                    <Link href={`/project/${project.id}/board`}>
                      <SquareKanban />
                      <span>{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}

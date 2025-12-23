"use client"
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
  SidebarTrigger
} from "@/components/ui/sidebar"
import { Bell, Home, Settings, SquareKanban } from "lucide-react"
import { projects } from "@/lib/placeholder-data"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const pathname = usePathname();

  return (
     <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 w-full p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary shrink-0">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-xl text-foreground truncate">Zenos</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/dashboard'} tooltip={{children: 'Painel'}}>
                <Link href="/dashboard"><Home /><span>Painel</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/notifications'} tooltip={{children: 'Notificações'}}>
                <Link href="/notifications"><Bell /><span>Notificações</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip={{children: 'Configurações'}}>
                <Link href="/settings"><Settings /><span>Configurações</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Projetos</SidebarGroupLabel>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(`/project/${project.id}`)} tooltip={{children: project.name}}>
                    <Link href={`/project/${project.id}/board`}>
                      <SquareKanban />
                      <span>{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
           <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
  )
}

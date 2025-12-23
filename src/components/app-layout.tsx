import { SidebarProvider, SidebarInset } from "./ui/sidebar";
import { AppSidebar } from "./sidebar";
import { Header } from "./header";

export function AppLayout({ children, headerContent }: { children: React.ReactNode, headerContent?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header>{headerContent}</Header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

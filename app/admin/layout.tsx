// app/admin/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 flex items-start justify-center px-4 pb-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6">{children}</main>
      </div>
      <BottomNav />
      <Toaster 
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "bg-popover/95 backdrop-blur-xl border border-border text-foreground",
            title: "text-foreground",
            description: "text-muted-foreground",
            success: "border-accent-success/30",
            error: "border-destructive/30",
          },
        }}
      />
    </div>
  );
}

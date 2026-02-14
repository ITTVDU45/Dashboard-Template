import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { UiStateProvider } from "@/components/providers/ui-state-provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UiStateProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main id="main-content" className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </UiStateProvider>
  )
}

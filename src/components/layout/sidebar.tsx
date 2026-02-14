"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navConfig } from "@/config/nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiState } from "@/components/providers/ui-state-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUiState();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen border-r border-border bg-sidebar/95 backdrop-blur-sm transition-all md:block",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center border-b border-border", isSidebarCollapsed ? "px-4 justify-center" : "px-6 justify-between")}>
        <Link href="/overview" className="focus-ring flex items-center gap-3 rounded-lg group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-glow transition-all duration-200 group-hover:scale-105">
            LP
          </div>
          {!isSidebarCollapsed ? (
            <span className="text-xl font-bold text-foreground tracking-tight">Pipeline</span>
          ) : null}
        </Link>
        {!isSidebarCollapsed ? (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Sidebar einklappen">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {/* Navigation */}
      <ScrollArea className={cn("h-[calc(100vh-4rem)] py-4", isSidebarCollapsed ? "px-2" : "px-3")}>
        <nav className="space-y-1">
          {isSidebarCollapsed ? (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mx-auto flex" aria-label="Sidebar ausklappen">
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          ) : null}
          {navConfig.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "focus-ring interactive-lift relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                  isSidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-primary/12 text-primary active-indicator"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "")} />
                {!isSidebarCollapsed ? <span className="flex-1">{item.title}</span> : null}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}

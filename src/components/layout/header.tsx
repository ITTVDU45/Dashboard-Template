"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center gap-2 md:gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-xl md:px-6">
      <Link href="/overview" className="focus-ring flex md:hidden items-center gap-2 rounded-md">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          LP
        </div>
        <span className="text-lg font-bold text-foreground">Pipeline</span>
      </Link>

      <div className="flex flex-1 items-center gap-2 md:gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Unternehmen, Projekte, Jobs suchen..."
            className="h-10 rounded-xl border-border bg-surface-2/50 pl-9 transition-all focus:border-primary/50 focus:bg-surface"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="interactive-lift h-10 gap-2 rounded-xl" aria-label="Neuen Eintrag erstellen">
              <Plus className="h-4 w-4" />
              Neu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-xl border-border">
            <DropdownMenuItem asChild><Link href="/companies/new">Neues Unternehmen</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/projects/new">Neues Projekt</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/workflows/new">Neuen Workflow starten</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

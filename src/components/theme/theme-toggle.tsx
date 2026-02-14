"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="sr-only">Theme wechseln</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Theme wechseln</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-xl border-border">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`focus:bg-accent ${theme === "light" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Sun className="mr-2 h-4 w-4" />
          Hell
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`focus:bg-accent ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Moon className="mr-2 h-4 w-4" />
          Dunkel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`focus:bg-accent ${theme === "system" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

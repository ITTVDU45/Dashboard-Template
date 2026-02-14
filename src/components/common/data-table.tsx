"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  mobileHidden?: boolean; // Hide this column on mobile card view
  mobileLabel?: string; // Custom label for mobile card view
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchBy?: (row: T) => string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  searchBy,
  onRowClick,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    if (!query.trim() || !searchBy) return data;
    return data.filter((row) =>
      searchBy(row).toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [data, query, searchBy]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const column = columns.find((entry) => entry.key === sortKey);
    if (!column?.sortValue) return filtered;

    return [...filtered].sort((a, b) => {
      const valueA = column.sortValue?.(a);
      const valueB = column.sortValue?.(b);
      if (valueA === valueB) return 0;
      if (valueA === undefined || valueA === null) return sortDirection === "asc" ? -1 : 1;
      if (valueB === undefined || valueB === null) return sortDirection === "asc" ? 1 : -1;
      if (sortDirection === "asc") return valueA > valueB ? 1 : -1;
      return valueA < valueB ? 1 : -1;
    });
  }, [columns, filtered, sortDirection, sortKey]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const showPagination = total > pageSize;

  function handleSort(nextSortKey: string) {
    if (sortKey !== nextSortKey) {
      setSortKey(nextSortKey);
      setSortDirection("asc");
      return;
    }
    setSortDirection((value) => (value === "asc" ? "desc" : "asc"));
  }

  return (
    <div className={cn("space-y-4", className)}>
      {searchBy ? (
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Suche..."
          className="max-w-sm"
        />
      ) : null}

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  <button
                    type="button"
                    className="focus-ring flex items-center gap-2 rounded-sm font-medium"
                    onClick={() => column.sortValue && handleSort(column.key)}
                    disabled={!column.sortValue}
                    aria-label={column.sortValue ? `${column.header} sortieren` : `${column.header} nicht sortierbar`}
                  >
                    {column.header}
                    {sortKey === column.key ? (sortDirection === "asc" ? "↑" : "↓") : null}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl opacity-30">📭</div>
                    <span>Keine Daten gefunden.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, index) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(event) => {
                    if (!onRowClick) return
                    if (event.key !== "Enter" && event.key !== " ") return
                    event.preventDefault()
                    onRowClick(row)
                  }}
                  role={onRowClick ? "button" : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  className={cn(
                    onRowClick && "focus-ring interactive-lift cursor-pointer hover:bg-muted/40",
                    "animate-fade-in motion-reduce:animate-none"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl opacity-30">📭</div>
                <span>Keine Daten gefunden.</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          paginated.map((row, index) => (
            <Card 
              key={row.id}
              onClick={() => onRowClick?.(row)}
              onKeyDown={(event) => {
                if (!onRowClick) return
                if (event.key !== "Enter" && event.key !== " ") return
                event.preventDefault()
                onRowClick(row)
              }}
              role={onRowClick ? "button" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              className={cn(
                "animate-fade-in motion-reduce:animate-none transition-all motion-reduce:transition-none motion-safe:active:scale-[0.99]",
                onRowClick && "focus-ring interactive-lift cursor-pointer active:bg-muted/50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4 space-y-3">
                {columns
                  .filter((col) => !col.mobileHidden)
                  .map((column, colIndex) => (
                    <div 
                      key={column.key} 
                      className={cn(
                        "flex items-start justify-between gap-2",
                        colIndex === 0 && "pb-2 border-b border-border"
                      )}
                    >
                      {colIndex > 0 && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {column.mobileLabel || column.header}
                        </span>
                      )}
                      <div className={cn(
                        colIndex === 0 ? "font-medium text-foreground" : "text-right flex-1",
                        column.className
                      )}>
                        {column.cell(row)}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {showPagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Seite <span className="font-medium text-foreground">{page}</span> von{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
            {" "}({total} Eintraege)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page <= 1}
              className="h-10 min-w-[80px]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurueck
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={page >= totalPages}
              className="h-10 min-w-[80px]"
            >
              Weiter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

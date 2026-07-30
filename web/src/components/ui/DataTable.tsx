import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  Printer,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  accessor?: (row: T) => string | number;
  hideable?: boolean;
  className?: string;
}

/** Safely read a property by key from an arbitrary object. */
function readKey<T>(row: T, key: string): unknown {
  if (row && typeof row === "object" && key in row) {
    return (row as Record<string, unknown>)[key];
  }
  return undefined;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  toolbarActions?: ReactNode;
  footerRow?: ReactNode;
  className?: string;
}

/** Generic data table with search, pagination, column visibility, CSV/PDF/print export. */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  searchable = true,
  searchPlaceholder = "Search...",
  pageSizeOptions = [10, 25, 50, 100],
  emptyMessage = "No data available in table",
  toolbarActions,
  footerRow,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [showColToggle, setShowColToggle] = useState(false);

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenCols.has(c.key)),
    [columns, hiddenCols],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => {
        const val = c.accessor ? c.accessor(row) : readKey(row, c.key);
        return String(val ?? "").toLowerCase().includes(q);
      }),
    );
  }, [data, search, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * pageSize;
  const paged = filtered.slice(start, start + pageSize);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + pageSize, filtered.length);

  const toggleCol = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const exportCSV = () => {
    const headers = visibleColumns.map((c) => c.header).join(",");
    const rows = filtered.map((row) =>
      visibleColumns
        .map((c) => {
          const val = c.accessor ? c.accessor(row) : readKey(row, c.key);
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printTable = () => {
    window.print();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {searchable && (
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0); }}>
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>records</span>
        </div>

        <div className="relative flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => setShowColToggle((s) => !s)} title="Show / hide columns">
            <Eye className="h-4 w-4" />
          </Button>
          {showColToggle && (
            <div className="absolute right-0 top-10 z-50 w-48 rounded-md border bg-popover p-2 shadow-lg">
              <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">Toggle columns</p>
              {columns.filter((c) => c.hideable !== false).map((c) => (
                <button
                  key={c.key}
                  onClick={() => toggleCol(c.key)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  {hiddenCols.has(c.key) ? (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-accent-foreground" />
                  )}
                  {c.header}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(JSON.stringify(filtered))} title="Copy">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={exportCSV} title="CSV">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">CSV</span>
        </Button>
        <Button variant="outline" size="sm" onClick={printTable} title="Print">
          <Printer className="h-4 w-4" />
        </Button>
        {toolbarActions}
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {visibleColumns.map((col) => (
                <TableHead key={col.key} className={cn("whitespace-nowrap", col.className)}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow key={rowKey(row)}>
                  {visibleColumns.map((col) => (
                    <TableCell key={col.key} className={cn("whitespace-nowrap", col.className)}>
                      {col.render ? col.render(row) : String(readKey(row, col.key) ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
          {footerRow}
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Showing {showingFrom} to {showingTo} of {filtered.length} entries
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 0} onClick={() => setPage(0)}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
                         }
      

// src/components/common/DataTable.tsx
import { type JSX, useEffect, useRef, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef
} from "@tanstack/react-table";
import { type DataTableProps } from "./DataTable.types";
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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingSpinner from "../LoadingSpinner";
import { ArrowDownTrayIcon, PrinterIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

// Utility function for safe nested property access
const getNestedValue = (obj: unknown, path: string): unknown => {
    return path.split(".").reduce((current, key) => {
        if (current && typeof current === "object" && key in current) {
            return (current as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj) ?? "";
};

const DataTable = <TData,>({
    columns,
    data,
    loading,
    error,
    headerButtons = [],
    page = 0,
    pageSize = 10,
    totalItems = 0,
    onPageChange,
    onPageSizeChange,
    onSearch,
    searchTerm = "",
    tableId,
}: DataTableProps<TData>) => {
    // Initialize column visibility from localStorage or default to all visible
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
        if (tableId) {
            const saved = localStorage.getItem(`table-column-visibility-${tableId}`);
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

    // Sync external searchTerm with local state
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    // Trigger onSearch with debounced value
    useEffect(() => {
        if (onSearch && debouncedSearchTerm !== searchTerm) {
            onSearch(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, onSearch, searchTerm]);

    const table = useReactTable({
        data,
        columns: columns as ColumnDef<TData>[],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalItems / pageSize),
        state: {
            pagination: { pageIndex: page, pageSize },
            columnVisibility,
        },
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function"
                    ? updater({ pageIndex: page, pageSize })
                    : updater;
            if (onPageChange) onPageChange(newState.pageIndex);
            if (onPageSizeChange) onPageSizeChange(newState.pageSize);
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    // Persist column visibility to localStorage
    useEffect(() => {
        if (tableId) {
            localStorage.setItem(`table-column-visibility-${tableId}`, JSON.stringify(columnVisibility));
        }
    }, [columnVisibility, tableId]);

    // Export to CSV
    const exportToCSV = () => {
        const visibleColumns = columns.filter((col) => {
            // Derive column ID: use col.id if present, else use accessorKey as string
            const columnId = col.id || ("accessorKey" in col ? String(col.accessorKey) : undefined);
            return columnId && table.getColumn(columnId)?.getIsVisible();
        });
        const headers = visibleColumns.map((col) => col.header as string).join(",");
        const rows = data.map((row) =>
            visibleColumns
                .map((col) => {
                    let value: unknown;
                    if ("accessorKey" in col && col.accessorKey) {
                        value = getNestedValue(row, String(col.accessorKey));
                    } else if ("accessorFn" in col && col.accessorFn) {
                        value = col.accessorFn(row, 0);
                    } else {
                        value = "";
                    }
                    return `"${String(value).replace(/"/g, '""')}"`;
                })
                .join(",")
        );
        const csv = [headers, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "table-data.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    // Print Table
    const tableRef = useRef<HTMLDivElement>(null);
    const printTable = () => {
        const printWindow = window.open("", "_blank");
        if (printWindow && tableRef.current) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Print Table</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            ${tableRef.current.querySelector("table")?.outerHTML || ""}
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    // Generate page numbers for pagination
    const renderPageNumbers = () => {
        const pageCount = table.getPageCount();
        const currentPage = page + 1; // 1-based for display
        const maxButtons = 5; // Maximum number of page buttons to show
        const buttons: JSX.Element[] = [];

        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        const endPage = Math.min(pageCount, startPage + maxButtons - 1);

        // Adjust startPage if endPage is at the limit
        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            buttons.push(
                <Button
                    key={1}
                    onClick={() => onPageChange?.(0)}
                    variant="outline"
                    size="sm"
                >
                    1
                </Button>
            );
            if (startPage > 2) {
                buttons.push(<span key="start-ellipsis" className="px-2">...</span>);
            }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    onClick={() => onPageChange?.(i - 1)}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                >
                    {i}
                </Button>
            );
        }

        // Add last page and ellipsis if needed
        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                buttons.push(<span key="end-ellipsis" className="px-2">...</span>);
            }
            buttons.push(
                <Button
                    key={pageCount}
                    onClick={() => onPageChange?.(pageCount - 1)}
                    variant="outline"
                    size="sm"
                >
                    {pageCount}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <div className="space-y-4" ref={tableRef}>
            {/* Header: Buttons and Search */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                {/* Search Input with Icon Inside */}
                {onSearch && (
                    <div className="relative w-full sm:w-auto">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            value={localSearchTerm}
                            onChange={(e) => setLocalSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="pl-10 max-w-sm"
                        />
                    </div>
                )}
                {/* Header Buttons + Export/Print + Column Visibility */}
                <div className="flex flex-wrap gap-2">
                    {headerButtons.map((button, index) => (
                        <Button
                            key={index}
                            onClick={button.onClick}
                            variant={button.variant || "default"}
                            className={cn(button.className)}
                        >
                            {button.icon && <span className="mr-0 sm:mr-2">{button.icon}</span>}
                            <span className="sm:inline-flex hidden">{button.label}</span>
                        </Button>
                    ))}
                    <Button onClick={exportToCSV} variant="outline">
                        <ArrowDownTrayIcon className="h-5 w-5 mr-0 sm:mr-2" />
                        <span className="sm:inline-flex hidden">Export</span>
                    </Button>
                    <Button onClick={printTable} variant="outline">
                        <PrinterIcon className="h-5 w-5 mr-0 sm:mr-2" />
                        <span className="sm:inline-flex hidden">Print</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Cog8ToothIcon className="h-5 w-5 mr-0 sm:mr-2" />
                                <span className="sm:inline-flex hidden">Columns</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table.getAllColumns().filter(col => col.getCanHide()).map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(value)}
                                >
                                    {column.columnDef.header as string}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table Content */}
            {loading && <LoadingSpinner />}
            {error && <div className="text-destructive p-4">Error: {error}</div>}
            {!loading && !error && data.length === 0 && (
                <div className="text-muted-foreground p-4">No data available</div>
            )}
            {!loading && !error && data.length > 0 && (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getIsSorted() === "asc" && (
                                                    <span className="ml-2">↑</span>
                                                )}
                                                {header.column.getIsSorted() === "desc" && (
                                                    <span className="ml-2">↓</span>
                                                )}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Pagination Controls */}
            {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground sm:inline-flex hidden">
                            Page {page + 1} of {table.getPageCount()}
                        </span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => onPageSizeChange?.(Number(value))}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select page size" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 15, 20, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size} per page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <Button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            variant="outline"
                            size="icon"
                            className="sm:w-auto w-8 h-8 p-0"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                            <span className="sm:inline-flex hidden sr-only">Previous</span>
                        </Button>
                        {renderPageNumbers()}
                        <Button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            variant="outline"
                            size="icon"
                            className="sm:w-auto w-8 h-8 p-0"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                            <span className="sm:inline-flex hidden sr-only">Next</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;